import {Controller, Post, Body, HttpException, HttpStatus} from '@nestjs/common'
import { UserService } from './user.service';
import {CreateUserDto} from "./dto/create-user-dto"

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  create(@Body() user: CreateUserDto) {
    if (!user.username || !user.password || !user.email) {
      throw new HttpException(
        'You must send username, password and email',
        HttpStatus.BAD_REQUEST
      )
    }

    // const user = userService.findByEmail(user.email)
    // if (user) {
    //   throw new HttpException({
    //     statusCode: HttpStatus.BAD_REQUEST,
    //     error: 'A user with that email already exists'
    //   })
    // }

    return this.userService.create(user)
  }
}
