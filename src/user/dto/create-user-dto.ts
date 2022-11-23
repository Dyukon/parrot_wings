import {IsString} from "class-validator"

export class CreateUserRequestDto {
  @IsString()
  username: string

  @IsString()
  password: string

  @IsString()
  email: string
}