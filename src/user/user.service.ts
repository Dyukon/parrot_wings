import {HttpException, HttpStatus, Injectable} from '@nestjs/common'
import {CreateUserDto} from "./dto/create-user-dto"
import {compare, genSalt, hash} from 'bcryptjs'
import {UserModel} from "./user.model"
import {LoginDto} from "../session/dto/login.dto"
import {randomBytes} from "crypto"
import {UserInfoDto} from "./dto/user-info.dto"
import {TransactionService} from "../transaction/transaction.service"
import {FilteredUserListResponseDto} from "./dto/filtered-user-list.dto"

@Injectable()
export class UserService {
  users: UserModel[]

  constructor(
    private readonly transactionService: TransactionService
  ) {
    this.users = []
  }

  async create(dto: CreateUserDto) {
    const id = randomBytes(10).toString('hex')
    const salt = await genSalt(10)
    const passwordHash = await hash(dto.password, salt)
    this.users.push(new UserModel(
      id,
      dto.username,
      dto.email,
      passwordHash
    ))
    return `User is created - users: ${JSON.stringify(this.users)}`
  }

  async findByEmail(email: string) {
    return this.users.find(x => x.email===email)
  }

  async findByName(name: string) {
    return this.users.find(x => x.name===name)
  }

  async findById(id: string) {
    return this.users.find(x => x.id===id)
  }

  async getInfoById(id: string) {
    const user = await this.findById(id)
    const balance = await this.transactionService.getBalanceByName(user.name)
    return new UserInfoDto(
      user.id,
      user.name,
      user.email,
      balance
    )
  }

  async getFilteredUserList(filter: string) {
    return this.users
      .filter(x => x.name.indexOf(filter)>-1)
      .map(x => new FilteredUserListResponseDto(x.id, x.name))
  }
}
