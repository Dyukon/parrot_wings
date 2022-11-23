import {HttpException, HttpStatus, Injectable} from '@nestjs/common'
import {CreateUserDto} from "./dto/create-user-dto"
import {compare, genSalt, hash} from 'bcryptjs'
import {UserDto} from "./dto/user.dto"
import {JwtService} from "@nestjs/jwt"
import {InjectRepository} from '@nestjs/typeorm'
import {User} from './user.entity'
import {DataSource, MongoRepository} from 'typeorm'
import {FilteredUserListResponseDto} from './dto/filtered-user-list.dto'
import {LoginDto} from './dto/login.dto'

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly userRepository: MongoRepository<User>,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService
  ) {}

  async create(dto: CreateUserDto) {
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

  async getInfoById(id: string): Promise<UserDto> {
    const user = await this.findById(id)
    return UserDto.fromUser(user)
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

  async updateBalances(
    senderId: string,
    senderBalance: number,
    recipientId: string,
    recipientBalance: number
  ) {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    let isError = false
    try {
      await this.userRepository.updateOne(
        { _id: senderId },
        { $set: {balance: senderBalance}}
      )
      await this.userRepository.updateOne(
        { _id: recipientId },
        { $set: {balance: recipientBalance}}
      )
    } catch (err) {
      isError = true
      await queryRunner.rollbackTransaction()
    } finally {
      await queryRunner.release()
    }

    if (isError) {
      throw new HttpException(
        'Transaction processing error',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
