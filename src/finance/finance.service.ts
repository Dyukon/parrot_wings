import { Injectable } from '@nestjs/common';
import { Transaction } from '../transaction/transaction.entity'
import { EntityManager } from 'typeorm'

@Injectable()
export class FinanceService {

  constructor() {}

  async getBalance(userId: string, entityManager: EntityManager) {
    const lastTransactions = await entityManager.find(Transaction, {
      where: [
        {senderId: userId},
        {recipientId: userId}
      ],
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
