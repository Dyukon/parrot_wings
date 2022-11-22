import {HttpException, HttpStatus, Injectable} from '@nestjs/common'
import {UserService} from "../user/user.service"
import {InjectRepository} from '@nestjs/typeorm'
import {MongoRepository} from 'typeorm'
import {Transaction} from './transaction.entity'
import {TransactionDto} from './dto/transaction.dto'
import {IdLib} from '../lib/id.lib'

@Injectable()
export class TransactionService {

  constructor(
    @InjectRepository(Transaction) private readonly transactionRepository: MongoRepository<Transaction>,
    private readonly userService: UserService
  ) {}

  async findBySenderId(senderId: string): Promise<TransactionDto[]> {
    const transactions = await this.transactionRepository.find({
      where: { senderId: senderId }
    })
    return transactions.map(x => TransactionDto.fromTransaction(x))
  }

  async createTransaction(senderEmail: string, recipientName: string, amount: number): Promise<TransactionDto>
  {
    const sender = await this.userService.findByEmail(senderEmail)
    const recipient = await this.userService.findByName(recipientName)

    if (!sender || !recipient) {
      throw new HttpException(
        'User not found',
        HttpStatus.NOT_FOUND
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

    // TODO: make an atomary operation!
    const mainTransaction = await this.transactionRepository.save({
      _id: IdLib.createId(),
      date: new Date(),
      senderId: sender._id,
      senderName: sender.name,
      recipientId: recipient._id,
      recipientName: recipient.name,
      amount: -amount,
      balance: senderBalance
    })
    const supplementaryTransaction = await this.transactionRepository.save({
      date: new Date(),
      senderId: recipient._id,
      senderName: recipient.name,
      recipientId: sender._id,
      recipientName: sender.name,
      amount: amount,
      balance: recipientBalance
    })
    await this.userService.updateBalanceById(
      sender._id,
      senderBalance
    )
    await this.userService.updateBalanceById(
      recipient._id,
      recipientBalance
    )

    return TransactionDto.fromTransaction(mainTransaction)
  }
}
