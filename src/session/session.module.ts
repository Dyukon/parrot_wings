import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import {UserModule} from "../user/user.module"
import {ConfigModule, ConfigService} from "@nestjs/config"
import {JwtModule} from "@nestjs/jwt"
import {getJwtConfig} from "../configs/jwt.config"

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig
    })
  ],
  controllers: [SessionController],
  providers: [SessionService]
})
export class SessionModule {}
