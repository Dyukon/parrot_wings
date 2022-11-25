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
import { UserService } from './user.service'
import { CreateUserRequestDto, CreateUserResponseDto } from './dto/create-user-dto'
import { FilteredUserListRequestDto } from './dto/filtered-user-list.dto'
import { JwtAuthGuard } from '../guards/jwt.guard'
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto'
import { ApiExtraModels } from '@nestjs/swagger'
import { UserDto } from './dto/user.dto'

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @ApiExtraModels(CreateUserResponseDto)
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Post('users')
  async create(@Body() dto: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    const userByEmail = await this.userService.findByEmail(dto.email)
    if (userByEmail) {
      throw new HttpException(
        'A user with that email already exists',
        HttpStatus.BAD_REQUEST
      )
    }

    const userByName = await this.userService.findByName(dto.username)
    if (userByName) {
      throw new HttpException(
        'A user with that name already exists',
        HttpStatus.BAD_REQUEST
      )
    }

    return await this.userService.create(dto)
  }

  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Post('sessions/create')
  async login(@Body() login: LoginRequestDto): Promise<LoginResponseDto> {
    if (!login.email || !login.password) {
      throw new HttpException(
        'You must send email and password',
        HttpStatus.BAD_REQUEST
      )
    }

    return await this.userService.login(login)
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/protected/user-info')
  async getUserInfo(@Request() req): Promise<UserDto> {
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

    return this.userService.getFilteredUserList(dto.filter, user._id)
  }
}
