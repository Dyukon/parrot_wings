import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { SWAGGER_AUTH_TOKEN } from '../../lib/constants.lib'

export class CreateUserRequestDto {
  @ApiProperty({ default: 'Test' })
  @IsString()
  username: string

  @ApiProperty({ default: 'test' })
  @IsString()
  password: string

  @ApiProperty({ default: 'test@test.test' })
  @IsString()
  email: string
}

export class CreateUserResponseDto {
  @ApiProperty({ default: SWAGGER_AUTH_TOKEN })
  @IsString()
  id_token: string
}