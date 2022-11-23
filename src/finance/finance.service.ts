import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Transaction } from '../transaction/transaction.entity'
import { MongoRepository } from 'typeorm'

@Injectable()
export class FinanceService {

  constructor(
    @InjectRepository(Transaction) private readonly transactionRepository: MongoRepository<Transaction>
  ) {}

  async getBalance(userId: string) {
    const lastTransactions = await this.transactionRepository.find({
      where: {
        $or: [
          {senderId: userId},
          {recipientId: userId}
        ]
      },
      order: {
        date: -1
      },
      take: 1
    })

    if (lastTransactions.length===0) {
      return 500
    }
    const lastTransaction = lastTransactions[0]
    const isSender = lastTransaction.senderId.toString()===userId.toString()
    return isSender ? lastTransaction.senderBalance : lastTransaction.recipientBalance
  }
}
