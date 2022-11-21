import {HttpException, HttpStatus, Injectable} from '@nestjs/common'
import {LoginDto} from "./dto/login.dto"
import {compare} from "bcryptjs"
import {UserService} from "../user/user.service"

@Injectable()
export class SessionService {
  constructor(private readonly userService: UserService) {}

  async login(login: LoginDto) {
    const user = await this.userService.findByEmail(login.email)
    console.log(`user: ${JSON.stringify(user)}`)
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

    return 'User is logged in'
  }
}
