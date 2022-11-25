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
import { FilteredUserDto, FilteredUserListRequestDto } from './dto/filtered-user-list.dto'
import { JwtAuthGuard } from '../guards/jwt.guard'
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto'
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger'
import { UserDto } from './dto/user.dto'
import { SWAGGER_AUTH_TOKEN } from '../lib/constants.lib'

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ type: CreateUserResponseDto} )
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

  @ApiOkResponse({ type: LoginResponseDto} )
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

  @ApiOkResponse({ type: UserDto })
  @ApiBearerAuth(SWAGGER_AUTH_TOKEN)
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

  @ApiOkResponse({
    type: FilteredUserDto,
    isArray: true
  })
  @ApiBearerAuth(SWAGGER_AUTH_TOKEN)
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('api/protected/users/list')
  async getFilteredUserList(@Request() req, @Body() dto: FilteredUserListRequestDto): Promise<FilteredUserDto[]> {
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
