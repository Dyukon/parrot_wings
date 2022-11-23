import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TransactionModule } from './transaction/transaction.module';
import {ConfigModule, ConfigService} from '@nestjs/config'
import {TypeOrmModule} from '@nestjs/typeorm'
import {User} from './user/user.entity'
import {Transaction} from './transaction/transaction.entity'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mongodb',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User, Transaction],
        synchronize: true,
      }),
    }),
    UserModule,
    TransactionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
