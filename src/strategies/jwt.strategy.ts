import {Injectable} from "@nestjs/common"
import {PassportStrategy} from "@nestjs/passport"
import {ConfigService} from "@nestjs/config"
import {ExtractJwt, Strategy} from "passport-jwt"
import {User} from '../user/user.entity'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET')
    })
  }

  async validate({ email }): Promise<Pick<User, 'email'>> {
    return {
      email: email
    }
  }
}