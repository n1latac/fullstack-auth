import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Sequelize } from 'sequelize';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../database/models/User.entity';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getGoogleRecaptchaConfig } from '../../config/recaptcha.config';
import { ProviderModule } from './provider/provider.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    GoogleRecaptchaModule.forRootAsync({
      //теперь можем повесить на какой то запрос декоратор @Recaptcha
      imports: [ConfigModule],
      useFactory: getGoogleRecaptchaConfig,
      inject: [ConfigService],
    }),
    ProviderModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService],
})
export class AuthModule {}
