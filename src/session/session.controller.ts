import {Body, Controller, HttpException, HttpStatus, Inject, Post, UsePipes, ValidationPipe} from '@nestjs/common'
import { SessionService } from './session.service';
import {LoginDto} from "./dto/login.dto"

@Controller()
export class SessionController {
  constructor(
    private readonly sessionService: SessionService
  ) {}

  @Post('sessions/create')
  @UsePipes(new ValidationPipe())
  async login(@Body() login: LoginDto) {
    console.log(`login: ${JSON.stringify(login)}`)

    if (!login.email || !login.password) {
      throw new HttpException(
        'You must send email and password',
        HttpStatus.BAD_REQUEST
      )
    }

    return await this.sessionService.login(login)
 }
}
