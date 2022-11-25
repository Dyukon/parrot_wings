import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginRequestDto {
  @ApiProperty()
  @IsString()
  email: string

  @ApiProperty()
  @IsString()
  password: string
}

export class LoginResponseDto {
  @ApiProperty()
  @IsString()
  id_token: string
}