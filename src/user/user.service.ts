import { Injectable } from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user-dto"
import {genSaltSync, hashSync} from 'bcryptjs'
import {UserModel} from "./user.model"

@Injectable()
export class UserService {
  users: UserModel[]

  constructor() {
    this.users = []
  }

  create(user: CreateUserDto) {
    const salt = genSaltSync(10)
    const passwordHash = hashSync(user.password, salt)
    this.users.push(new UserModel(
      user.username,
      user.email,
      passwordHash
    ))
    return `User is created - users: ${JSON.stringify(this.users)}`
  }

  comparePasswordToHash(password: string, hash: string) {
    return true // TODO
  }
}
