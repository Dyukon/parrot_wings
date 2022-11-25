import { ApiProperty } from '@nestjs/swagger'
import { TransactionDto } from './transaction.dto'

export class GetTransactionsResponseDto {
  @ApiProperty({ type: TransactionDto, isArray: true })
  trans_token: TransactionDto[]
}