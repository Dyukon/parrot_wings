import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, MongoRepository } from 'typeorm'
import { Transaction } from './transaction.entity'
import { TransactionDto } from './dto/transaction.dto'

@Injectable()
export class TransactionService {

  constructor(
    @InjectRepository(Transaction) private readonly transactionRepository: MongoRepository<Transaction>,
    private readonly dataSource: DataSource,
    private readonly userService: UserService
  ) {}

  async findBySenderId(senderId: string): Promise<TransactionDto[]> {
    const transactions = await this.transactionRepository.find({
      where: { senderId: senderId }
    })
    return transactions.map(x => TransactionDto.fromTransaction(x))
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

    if (sender.balance < amount) {
      throw new HttpException(
        'Balance exceeded',
        HttpStatus.BAD_REQUEST
      )
    }

    const senderBalance = sender.balance - amount
    const recipientBalance = recipient.balance + amount

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    let transaction: Transaction
    let isError = false
    try {
      const mainTransaction = new Transaction()
      Object.assign(mainTransaction, {
        date: new Date(),
        senderId: sender._id,
        senderName: sender.name,
        recipientId: recipient._id,
        recipientName: recipient.name,
        amount: -amount,
        balance: senderBalance
      })
      transaction = await queryRunner.manager.save(mainTransaction)

      const supplementaryTransaction = new Transaction()
      Object.assign(supplementaryTransaction,{
        date: new Date(),
        senderId: recipient._id,
        senderName: recipient.name,
        recipientId: sender._id,
        recipientName: sender.name,
        amount: amount,
        balance: recipientBalance
      })
      await queryRunner.manager.save(supplementaryTransaction)
    } catch (err) {
      console.log(`err: ${err}`)
      isError = true
      await queryRunner.rollbackTransaction()
    } finally {
      await queryRunner.release()
    }

    if (isError) {
      throw new HttpException(
        'Transaction processing error',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }

    await this.userService.updateBalances(
      sender._id,
      senderBalance,
      recipient._id,
      recipientBalance
    )

    return TransactionDto.fromTransaction(transaction)
  }
}
