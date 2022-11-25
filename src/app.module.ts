import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { TransactionModule } from './transaction/transaction.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FinanceModule } from './finance/finance.module';
import { typeOrmConfig } from './configs/typeorm.config'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig
    }),
    UserModule,
    TransactionModule,
    FinanceModule
  ]
})
export class AppModule {
}
