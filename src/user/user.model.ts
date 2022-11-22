export class UserModel {
  id: string
  name: string
  email: string
  passwordHash: string
  balance: number

  constructor(
    id: string,
    name: string,
    email: string,
    passwordHash: string,
    balance: number
  ) {
    this.id = id
    this.name = name
    this.email = email
    this.passwordHash = passwordHash
    this.balance = balance
  }
}