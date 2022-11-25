import { IsNumber, IsString } from 'class-validator'
import { TransactionDto } from './transaction.dto'
import { ApiProperty } from '@nestjs/swagger'

export class CreateTransactionRequestDto {
  @ApiProperty({ default: 'SomeUser' })
  @IsString()
  name: string

  @ApiProperty({ default: 50 })
  @IsNumber()
  amount: number
}

export class CreateTransactionResponseDto {
  @ApiProperty({ type: TransactionDto })
  trans_token: TransactionDto
}