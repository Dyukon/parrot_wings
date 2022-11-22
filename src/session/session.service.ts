import {HttpException, HttpStatus, Injectable} from '@nestjs/common'
import {LoginDto} from "./dto/login.dto"
import {compare} from "bcryptjs"
import {UserService} from "../user/user.service"
import {JwtService} from "@nestjs/jwt"

@Injectable()
export class SessionService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async login(login: LoginDto) {
    const user = await this.userService.findByEmail(login.email)
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
}
