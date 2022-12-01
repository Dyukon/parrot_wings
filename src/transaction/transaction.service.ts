import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { Transaction } from './transaction.entity'
import { TransactionDto } from './dto/transaction.dto'
import { FinanceService } from '../finance/finance.service'

@Injectable()
export class TransactionService {

  constructor(
    @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
    private readonly dataSource: DataSource,
    private readonly financeService: FinanceService,
    private readonly userService: UserService
  ) {}

  async findByUserId(userId: string): Promise<TransactionDto[]> {
    const transactions = await this.transactionRepository.find({
      where: [
        {senderId: userId},
        {recipientId: userId}
      ],
      order: {
        date: 1
      }
    })
    return transactions.map(x => TransactionDto.fromTransaction(x, userId))
  }

  async createTransaction(
    senderEmail: string,
    recipientName: string,
    amount: number
  ): Promise<TransactionDto>
  {
    const sender = await this.userService.findByEmail(senderEmail)
    const recipient = await this.userService.findByName(recipientName)

    if (!sender || !recipient) {
      throw new HttpException(
        'User not found',
        HttpStatus.NOT_FOUND
      )
    }

    if (sender._id.toString() === recipient._id.toString()) {
      throw new HttpException(
        'Cannot make transfer to the same user',
        HttpStatus.BAD_REQUEST
      )
    }

    let transaction

    await this.dataSource.transaction(async (transactionalEntityManager) => {
      const senderBalance = await this.financeService.getBalance(sender._id, transactionalEntityManager)
      if (senderBalance < amount) {
        throw new HttpException(
          'Balance exceeded',
          HttpStatus.BAD_REQUEST
        )
      }
      const newSenderBalance = senderBalance - amount

      const recipientBalance = await this.financeService.getBalance(recipient._id, transactionalEntityManager)
      const newRecipientBalance = recipientBalance + amount

      transaction = await transactionalEntityManager.save(Transaction, {
        date: new Date(),
        senderId: sender._id,
        senderName: sender.name,
        recipientId: recipient._id,
        recipientName: recipient.name,
        amount: amount,
        senderBalance: newSenderBalance,
        recipientBalance: newRecipientBalance
      })
    })

    return TransactionDto.fromTransaction(transaction, sender._id)
  }
}
