import {IsString} from "class-validator"

export class FilteredUserListRequestDto {
  @IsString()
  filter: string
}

export class FilteredUserListResponseDto {
  id: string
  name: string

  constructor(
    id: string,
    name: string
  ) {
    this.id = id
    this.name = name
  }
}