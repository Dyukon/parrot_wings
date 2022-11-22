import {HttpException, HttpStatus, Injectable} from '@nestjs/common'
import {CreateTransactionDto} from "./dto/create-transaction.dto"
import {TransactionModel} from "./transaction.model"
import {UserService} from "../user/user.service"
import {InjectRepository} from '@nestjs/typeorm'
import {MongoRepository} from 'typeorm'
import {Transaction} from './transaction.entity'

@Injectable()
export class TransactionService {

  constructor(
    @InjectRepository(Transaction) private readonly transactionRepository: MongoRepository<Transaction>,
    private readonly userService: UserService
  ) {}

  async findByName(name: string) {
    return await this.transactionRepository.find({
      where: { username: name }
    })
  }

  async createTransaction(dto: CreateTransactionDto) {
    const user = await this.userService.findByName(dto.name)
    if (!user) {
      throw new HttpException(
        'User not found',
        HttpStatus.NOT_FOUND
      )
    }

    const oldBalance = user.balance
    const balance = oldBalance + dto.amount
    if (balance < 0) {
      throw new HttpException(
        'Balance exceeded',
        HttpStatus.BAD_REQUEST
      )
    }

    const transaction = await this.transactionRepository.create({
      date: new Date(),
      username: dto.name,
      amount: dto.amount,
      balance
    })

    await this.userService.updateBalanceById(user._id, balance)

    return transaction
  }
}
