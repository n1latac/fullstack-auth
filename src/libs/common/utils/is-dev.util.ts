import { ConfigService } from '@nestjs/config';
import * as process from 'node:process';

import * as dotenv from 'dotenv';

dotenv.config();

export const isDev = (configService: ConfigService) => {
  return configService.get<string>('NODE_ENV') === 'development';
};

export const IS_DEV_ENV = process.env.NODE_ENV === 'development';
