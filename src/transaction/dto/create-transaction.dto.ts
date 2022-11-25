import { IsNumber, IsString } from 'class-validator'
import { TransactionDto } from './transaction.dto'
import { ApiProperty } from '@nestjs/swagger'

export class CreateTransactionRequestDto {
  @IsString()
  name: string

  @IsNumber()
  amount: number
}

export class CreateTransactionResponseDto {
  @ApiProperty()
  trans_token: TransactionDto
}