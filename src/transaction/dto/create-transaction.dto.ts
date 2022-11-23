import {IsNumber, IsString} from "class-validator"

export class CreateTransactionRequestDto {
  @IsString()
  name: string

  @IsNumber()
  amount: number
}