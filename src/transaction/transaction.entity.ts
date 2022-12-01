import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity('pw_transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
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