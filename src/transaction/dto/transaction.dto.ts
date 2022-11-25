import { DateLib } from '../../lib/date.lib'
import { Transaction } from '../transaction.entity'
import { ApiProperty } from '@nestjs/swagger'

export class TransactionDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  date: string

  @ApiProperty()
  username: string

  @ApiProperty()
  amount: number

  @ApiProperty()
  balance: number

  static fromTransaction(t: Transaction, userId: string): TransactionDto {
    const isSender = t.senderId.toString()===userId.toString()
    return {
      id: t._id,
      date: DateLib.formatDate(t.date),
      username: (isSender ? t.recipientName : t.senderName),
      amount: (isSender ? -t.amount : t.amount),
      balance: (isSender ? t.senderBalance : t.recipientBalance)
    }
  }
}
