import {Body, Controller, HttpException, HttpStatus, Inject, Post} from '@nestjs/common'
import { SessionService } from './session.service';
import {LoginDto} from "./dto/login.dto"
import {UserService} from "../user/user.service"

@Controller()
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly userService: UserService
  ) {}

  @Post('sessions/create')
  login(@Body() login: LoginDto) {
    console.log(`login: ${JSON.stringify(login)}`)

    if (!login.email || !login.password) {
      throw new HttpException(
        'You must send email and password',
        HttpStatus.BAD_REQUEST
      )
    }

    // const user = this.userService.findOneByEmail(login.email)
    // if (!user) {
    //   throw new HttpException(
    //     'User not found',
    //     HttpStatus.NOT_FOUND
    //   )
    // }

    // const isRightPassword = this.userService.comparePasswordToHash(login.password, user.passwordHash)
    // if (!isRightPassword) {
    //   throw new HttpException(
    //     'Invalid password',
    //     HttpStatus.UNAUTHORIZED
    //   )
    // }

    return this.sessionService.login(login)
  }
}
