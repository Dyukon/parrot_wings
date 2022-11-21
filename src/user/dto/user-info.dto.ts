export class UserInfoDto {
  id: string
  name: string
  email: string
  balance: number

  constructor(
    id: string,
    name: string,
    email: string,
    balance: number
  ) {
    this.id = id
    this.name = name
    this.email = email
    this.balance = balance
  }
}