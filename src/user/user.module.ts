import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {JwtModule} from "@nestjs/jwt"
import {ConfigModule, ConfigService} from "@nestjs/config"
import {getJwtConfig} from "../configs/jwt.config"
import {PassportModule} from "@nestjs/passport"
import {JwtStrategy} from "../strategies/jwt.strategy"
import {TypeOrmModule} from '@nestjs/typeorm'
import {User} from './user.entity'

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig
    }),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [UserService]
})
export class UserModule {}
