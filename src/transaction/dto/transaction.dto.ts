import { DateLib } from '../../lib/date.lib'
import { Transaction } from '../transaction.entity'
import { ApiProperty } from '@nestjs/swagger'

export class TransactionDto {
  @ApiProperty({ default: '507f191e810c19729de860ea' })
  id: string

  @ApiProperty({ default: '25.11.2022, 14:35:26' })
  date: string

  @ApiProperty({ default: 'SomeUser' })
  username: string

  @ApiProperty({ default: -50 })
  amount: number

  @ApiProperty({ default: 450 })
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
