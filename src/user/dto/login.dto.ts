import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { SWAGGER_AUTH_TOKEN } from '../../lib/constants.lib'

export class LoginRequestDto {
  @ApiProperty({ default: 'test@test.test' })
  @IsString()
  email: string

  @ApiProperty({ default: 'test' })
  @IsString()
  password: string
}

export class LoginResponseDto {
  @ApiProperty({ default: SWAGGER_AUTH_TOKEN })
  @IsString()
  id_token: string
}