import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserRequestDto {
  @ApiProperty()
  @IsString()
  username: string

  @ApiProperty()
  @IsString()
  password: string

  @ApiProperty()
  @IsString()
  email: string
}

export class CreateUserResponseDto {
  @ApiProperty()
  @IsString()
  id_token: string
}