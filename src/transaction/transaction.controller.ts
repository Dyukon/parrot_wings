import {Body, Controller, Get, Post, UsePipes, ValidationPipe} from '@nestjs/common'
import { TransactionService } from './transaction.service';
import {CreateTransactionDto} from "./dto/create-transaction.dto"

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('api/protected/transactions')
  getTransactions() {
    const transactions = this.transactionService.findByName('')
    return {
      trans_token: transactions
    }
  }

  @UsePipes(new ValidationPipe())
  @Post('api/protected/transactions')
  createTransaction(@Body() dto: CreateTransactionDto) {
    const transaction = this.transactionService.createTransaction(dto)
    return {
      trans_token: transaction
    }
  }
}
