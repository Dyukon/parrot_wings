import { ApiProperty } from '@nestjs/swagger'
import { TransactionDto } from './transaction.dto'

export class GetTransactionsResponseDto {
  @ApiProperty()
  trans_token: TransactionDto[]
}