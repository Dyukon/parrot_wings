import { IsString } from 'class-validator'
import { User } from '../user.entity'
import { ApiProperty } from '@nestjs/swagger'

export class FilteredUserListRequestDto {
  @ApiProperty({ default: 'some' })
  @IsString()
  filter: string
}

export class FilteredUserDto {
  @ApiProperty({ default: '507f191e810c19729de860ea' })
  id: string

  @ApiProperty({ default: 'SomeUser' })
  name: string

  static fromUser(u: User): FilteredUserDto {
    return {
      id: u._id,
      name: u.name
    }
  }
}