import {HttpException, HttpStatus, Injectable} from '@nestjs/common'
import {CreateUserDto} from "./dto/create-user-dto"
import {compare, genSalt, hash} from 'bcryptjs'
import {randomBytes} from "crypto"
import {UserInfoDto} from "./dto/user-info.dto"
import {JwtService} from "@nestjs/jwt"
import {InjectRepository} from '@nestjs/typeorm'
import {User} from './user.entity'
import {MongoRepository} from 'typeorm'
import {FilteredUserListResponseDto} from './dto/filtered-user-list.dto'
import {IdLib} from '../lib/id.lib'
import {LoginDto} from './dto/login.dto'

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly userRepository: MongoRepository<User>,
    private readonly jwtService: JwtService
  ) {}

  async create(dto: CreateUserDto) {
    const id = IdLib.createId()
    const salt = await genSalt(10)
    const passwordHash = await hash(dto.password, salt)

    this.userRepository.save({
      id: id,
      name: dto.username,
      email: dto.email,
      passwordHash,
      balance: 500
    })

    const payload = {
      email: dto.email
    }
    return {
      id_token: await this.jwtService.signAsync(payload)
    }
  }

  async login(login: LoginDto) {
    const user = await this.findByEmail(login.email)
    if (!user) {
      throw new HttpException(
        'User not found',
        HttpStatus.NOT_FOUND
      )
    }

    const isRightPassword = await compare(login.password, user.passwordHash)
    if (!isRightPassword) {
      throw new HttpException(
        'Invalid password',
        HttpStatus.UNAUTHORIZED
      )
    }

    const payload = {
      email: login.email
    }
    return {
      id_token: await this.jwtService.signAsync(payload)
    }
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email: email }
    })
  }

  async findByName(name: string) {
    return await this.userRepository.findOne({
      where: { name: name }
    })
  }

  async findById(id: string) {
    return await this.userRepository.findOne({
      where: { _id: id }
    })
  }

  async getInfoById(id: string) {
    const user = await this.findById(id)
    return new UserInfoDto(
      user._id,
      user.name,
      user.email,
      user.balance
    )
  }

  async getFilteredUserList(filter: string): Promise<FilteredUserListResponseDto[]> {
    const regex: any = new RegExp(filter, 'i')
    const users = await this.userRepository.find({
      where: {
        name: regex
      }
    })
    return users.map(x => ({
      id: x._id,
      name: x.name
    }))
  }

  async updateBalanceById(id: string, balance: number) {
    return await this.userRepository.updateOne(
      { _id: id },
      { $set: {balance: balance}}
    )
  }
}
