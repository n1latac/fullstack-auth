import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModuleAsyncOptions } from '@nestjs/sequelize';
import { User } from '../models/User.entity';
import { Account } from '../models/Account.entity';
import { Token } from '../models/Token.entity';

const models = [User, Account, Token];

export const sequelizeRootConfig = (): SequelizeModuleAsyncOptions => {
  return {
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      dialect: 'mysql',
      host: configService.get<string>('MYSQL_HOST'),
      port: configService.get<number>('MYSQL_PORT'),
      username: configService.get<string>('MYSQL_USER'),
      password: configService.get<string>('MYSQL_PASSWORD'),
      database: configService.get<string>('MYSQL_DATABASE'),
      models,
    }),
    inject: [ConfigService],
  };
};
