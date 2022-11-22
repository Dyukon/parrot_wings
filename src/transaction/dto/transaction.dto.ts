import {DateLib} from '../../lib/date.lib'
import {Transaction} from '../transaction.entity'

export class TransactionDto {
  id: string
  date: string
  username: string
  amount: number
  balance: number

  static fromTransaction(t: Transaction): TransactionDto {
    return {
      id: t._id,
      date: DateLib.formatDate(t.date),
      username: t.recipientName,
      amount: t.amount,
      balance: t.balance
    }
  }
}
