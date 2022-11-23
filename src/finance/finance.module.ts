import { Module } from '@nestjs/common'
import { FinanceService } from './finance.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Transaction } from '../transaction/transaction.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction])
  ],
  controllers: [],
  providers: [FinanceService],
  exports: [FinanceService]
})
export class FinanceModule {
}
