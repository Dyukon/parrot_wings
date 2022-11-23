import { ConfigService } from '@nestjs/config'
import { User } from '../user/user.entity'
import { Transaction } from '../transaction/transaction.entity'

export const typeOrmConfig = (configService: ConfigService) => {
  const dbType: any = configService.get('DB_TYPE')
  return {
    type: dbType,
    host: configService.get('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
    entities: [User, Transaction],
    synchronize: true,
    useUnifiedTopology: true
  }
}