import { Column, Entity, Index, ObjectIdColumn } from 'typeorm'

@Entity()
export class Transaction {
  @ObjectIdColumn()
  _id: string

  @Index()
  @Column()
  senderId: string

  @Column()
  senderName: string

  @Index()
  @Column()
  recipientId: string

  @Column()
  recipientName: string

  @Index()
  @Column()
  date: Date

  @Column()
  amount: number

  @Column()
  senderBalance: number

  @Column()
  recipientBalance: number
}