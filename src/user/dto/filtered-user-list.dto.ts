import {IsString} from "class-validator"
import {User} from '../user.entity'

export class FilteredUserListRequestDto {
  @IsString()
  filter: string
}

export class FilteredUserListResponseDto {
  id: string
  name: string

  static fromUser(u: User): FilteredUserListResponseDto {
    return {
      id: u._id,
      name: u.name
    }
  }
}