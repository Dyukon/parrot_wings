import {randomBytes} from "crypto"

export class TransactionModel {
  id: string
  date: Date
  username: string
  amount: number
  balance: number

  constructor(
    username: string,
    amount: number,
    balance: number
  ) {
    this.id = randomBytes(10).toString('hex')
    this.date = new Date()
    this.username = username
    this.amount = amount
    this.balance = balance
  }
}