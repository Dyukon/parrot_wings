import {Body, Controller, Get, Post} from '@nestjs/common'
import { TransactionService } from './transaction.service';
import {CreateTransactionDto} from "./dto/create-transaction.dto"

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('api/protected/transactions')
  getTransactions() {
    return this.transactionService.getTransactions()
  }

  @Post('api/protected/transactions')
  createTransaction(@Body() transaction: CreateTransactionDto) {
    return this.transactionService.createTransaction(transaction)
  }
}
