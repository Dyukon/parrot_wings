import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SessionModule } from './session/session.module';
import { TransactionModule } from './transaction/transaction.module';
import {ConfigModule} from "@nestjs/config"

@Module({
  imports: [
    UserModule,
    SessionModule,
    TransactionModule,
    ConfigModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}