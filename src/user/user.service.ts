import {Injectable} from '@nestjs/common'
import {CreateUserDto} from "./dto/create-user-dto"
import {genSalt, hash} from 'bcryptjs'
import {UserModel} from "./user.model"
import {randomBytes} from "crypto"
import {UserInfoDto} from "./dto/user-info.dto"
import {FilteredUserListResponseDto} from "./dto/filtered-user-list.dto"
import {JwtService} from "@nestjs/jwt"

@Injectable()
export class UserService {
  users: UserModel[]

  constructor(
    private readonly jwtService: JwtService
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
      passwordHash,
      0
    ))

    const payload = {
      email: dto.email
    }
    return {
      id_token: await this.jwtService.signAsync(payload)
    }
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
    return new UserInfoDto(
      user.id,
      user.name,
      user.email,
      user.balance
    )
  }

  async getFilteredUserList(filter: string) {
    return this.users
      .filter(x => x.name.indexOf(filter)>-1)
      .map(x => new FilteredUserListResponseDto(x.id, x.name))
  }
}
