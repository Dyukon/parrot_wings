import {
  Controller,
  Post,
  Request,
  Body,
  HttpException,
  HttpStatus,
  Get,
  UseGuards,
  UsePipes,
  ValidationPipe, HttpCode
} from '@nestjs/common'
import { UserService } from './user.service';
import {CreateUserDto} from "./dto/create-user-dto"
import {FilteredUserListRequestDto} from "./dto/filtered-user-list.dto"
import {JwtAuthGuard} from "../guards/jwt.guard"

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Post('users')
  async create(@Body() dto: CreateUserDto) {
    const user = await this.userService.findByEmail(dto.email)
    if (user) {
      throw new HttpException(
        'A user with that email already exists',
        HttpStatus.BAD_REQUEST
      )
    }

    return await this.userService.create(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/protected/user-info')
  async getUserInfo(@Request() req) {
    const user = await this.userService.findByEmail(req.user.email)
    if (!user) {
      throw new HttpException(
        'Invalid user',
        HttpStatus.UNAUTHORIZED
      )
    }
    return await this.userService.getInfoById(user._id)
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('api/protected/users/list')
  async getFilteredUserList(@Request() req, @Body() dto: FilteredUserListRequestDto) {
    const user = await this.userService.findByEmail(req.user.email)
    if (!user) {
      throw new HttpException(
        'Invalid user',
        HttpStatus.UNAUTHORIZED
      )
    }

    return this.userService.getFilteredUserList(dto.filter)
  }
}
