import { IsString } from 'class-validator'
import { User } from '../user.entity'
import { ApiProperty } from '@nestjs/swagger'

export class FilteredUserListRequestDto {
  @ApiProperty()
  @IsString()
  filter: string
}

export class FilteredUserListResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  static fromUser(u: User): FilteredUserListResponseDto {
    return {
      id: u._id,
      name: u.name
    }
  }
}