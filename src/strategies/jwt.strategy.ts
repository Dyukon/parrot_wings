import {Injectable} from "@nestjs/common"
import {PassportStrategy} from "@nestjs/passport"
import {ConfigService} from "@nestjs/config"
import {ExtractJwt, Strategy} from "passport-jwt"
import {UserModel} from "../user/user.model"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_SECRET')
    })
  }

  async validate({ email }): Promise<Pick<UserModel, 'email'>> {
    return {
      email: email
    }
  }
}