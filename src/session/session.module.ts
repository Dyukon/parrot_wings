import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import {UserModule} from "../user/user.module"

@Module({
  imports: [UserModule],
  controllers: [SessionController],
  providers: [SessionService]
})
export class SessionModule {}
