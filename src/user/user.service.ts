import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateUserRequestDto } from './dto/create-user-dto'
import { compare, genSalt, hash } from 'bcryptjs'
import { UserDto } from './dto/user.dto'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity'
import { MongoRepository } from 'typeorm'
import { FilteredUserListResponseDto } from './dto/filtered-user-list.dto'
import { LoginRequestDto } from './dto/login.dto'
import { Transaction } from '../transaction/transaction.entity'
import { FinanceService } from '../finance/finance.service'

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly userRepository: MongoRepository<User>,
    @InjectRepository(Transaction) private readonly transactionRepository: MongoRepository<Transaction>,
    private readonly jwtService: JwtService,
    private readonly financeService: FinanceService
  ) {}

  async create(dto: CreateUserRequestDto) {
    const salt = await genSalt(10)
    const passwordHash = await hash(dto.password, salt)

    this.userRepository.save({
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

  async login(login: LoginRequestDto) {
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
      where: {email: email}
    })
  }

  async findByName(name: string) {
    return await this.userRepository.findOne({
      where: {name: name}
    })
  }

  async findById(id: string) {
    return await this.userRepository.findOne({
      where: {_id: id}
    })
  }

  async getInfoById(id: string): Promise<UserDto> {
    const user = await this.findById(id)
    const balance = await this.financeService.getBalance(id)
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      balance: balance
    }
  }

  async getFilteredUserList(filter: string, excludedId: string): Promise<FilteredUserListResponseDto[]> {
    const regex: any = new RegExp(filter, 'i')
    const users = await this.userRepository.find({
      where: {
        name: regex
      }
    })

    return users
      .map(x => FilteredUserListResponseDto.fromUser(x))
      .filter(x => x.id.toString() !== excludedId.toString())
  }
}
