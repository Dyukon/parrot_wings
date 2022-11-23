import { User } from '../user.entity'

export class UserDto {
  id: string
  name: string
  email: string
  balance: number

  static fromUser(u: User): UserDto {
    return {
      id: u._id,
      name: u.name,
      email: u.email,
      balance: u.balance
    }
  }
}