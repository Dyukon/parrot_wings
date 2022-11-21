import {HttpException, HttpStatus, Injectable} from '@nestjs/common'
import {CreateTransactionDto} from "./dto/create-transaction.dto"
import {TransactionModel} from "./transaction.model"
import {UserService} from "../user/user.service"

@Injectable()
export class TransactionService {

  private transactions: TransactionModel[]

  constructor(
    private readonly userService: UserService
  ) {
    this.transactions = []
  }

  async findByName(name: string) {
    return this.transactions
      .filter(x => x.username===name || name==='')
  }

  async getBalanceByName(name: string) {
    const transactions = await this.findByName(name)
    return transactions.reduce((accumulator, transaction) => {
      return accumulator + transaction.balance
    }, 0)
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

    const transaction = new TransactionModel(
      dto.name,
      dto.amount,
      balance
    )

    user.balance = balance
    this.transactions.push(transaction)

    return transaction
  }
}
