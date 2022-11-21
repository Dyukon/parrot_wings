import {Controller, Post, Body, HttpException, HttpStatus, Get} from '@nestjs/common'
import { UserService } from './user.service';
import {CreateUserDto} from "./dto/create-user-dto"
import {FilteredUserListRequestDto} from "./dto/filtered-user-list.dto"

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  async create(@Body() dto: CreateUserDto) {
    if (!dto.username || !dto.password || !dto.email) {
      throw new HttpException(
        'You must send username, password and email',
        HttpStatus.BAD_REQUEST
      )
    }

    const user = await this.userService.findByEmail(dto.email)
    if (user) {
      throw new HttpException(
        'A user with that email already exists',
        HttpStatus.BAD_REQUEST
      )
    }

    return await this.userService.create(dto)
  }

  @Get('api/protected/user-info')
  async getUserInfo() {
    const id = '' // TODO
    return await this.userService.getInfoById(id)
  }

  @Post('api/protected/users/list')
  async getFilteredUserList(@Body() dto: FilteredUserListRequestDto) {
    return this.userService.getFilteredUserList(dto.filter)
  }
}
