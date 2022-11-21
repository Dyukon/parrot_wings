import { Injectable } from '@nestjs/common';
import {LoginDto} from "./dto/login.dto"

@Injectable()
export class SessionService {

  login(login: LoginDto) {
    return 'User is logged here'
  }

  findOneByEmail(email: string) {
    return null // TODO
  }
}
