import {Injectable} from '@nestjs/common'
import {CreateUserDto} from "./dto/create-user-dto"
import {genSalt, hash} from 'bcryptjs'
import {randomBytes} from "crypto"
import {UserInfoDto} from "./dto/user-info.dto"
import {JwtService} from "@nestjs/jwt"
import {InjectRepository} from '@nestjs/typeorm'
import {User} from './user.entity'
import {MongoRepository} from 'typeorm'

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly userRepository: MongoRepository<User>,
    private readonly jwtService: JwtService
  ) {}

  async create(dto: CreateUserDto) {
    const id = randomBytes(10).toString('hex')
    const salt = await genSalt(10)
    const passwordHash = await hash(dto.password, salt)

    this.userRepository.save({
      id: id,
      name: dto.username,
      email: dto.email,
      passwordHash,
      balance: 0
    })

    const payload = {
      email: dto.email
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

  async getFilteredUserList(filter: string) {
    return await this.userRepository.find({
      where: {
        $regex: filter
      }
    })
  }

  async updateBalanceById(id: string, balance: number) {
    return await this.userRepository.updateOne(
      { _id: id },
      { balance: balance}
    )
  }
}
