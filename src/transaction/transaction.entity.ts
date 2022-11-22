import {Column, Entity, ObjectIdColumn} from 'typeorm'

@Entity()
export class Transaction {
  @ObjectIdColumn()
  _id: string

  @Column()
  date: Date

  @Column()
  username: string

  @Column()
  amount: number

  @Column()
  balance: number
}