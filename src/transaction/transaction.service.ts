import { Injectable } from '@nestjs/common';
import {CreateTransactionDto} from "./dto/create-transaction.dto"

@Injectable()
export class TransactionService {

  getTransactions() {
    return [] // TODO
  }

  createTransaction(transaction: CreateTransactionDto) {
    return 'Transaction is created here'
  }
}
