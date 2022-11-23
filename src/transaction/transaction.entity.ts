import { Column, Entity, ObjectIdColumn } from 'typeorm'

@Entity()
export class Transaction {
  @ObjectIdColumn()
  _id: string

  @Column()
  senderId: string

  @Column()
  senderName: string

  @Column()
  recipientId: string

  @Column()
  recipientName: string

  @Column()
  date: Date

  @Column()
  amount: number

  @Column()
  balance: number
}