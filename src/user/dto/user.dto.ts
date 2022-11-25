import { User } from '../user.entity'
import { ApiProperty } from '@nestjs/swagger'

export class UserDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  email: string

  @ApiProperty()
  balance: number
}