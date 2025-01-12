import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import IORedis from 'ioredis';

import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import ms from 'ms';
import { parseBoolean } from './libs/common/utils/parse-boolean.utils';
import { RedisStore } from 'connect-redis';
import { parseMs } from './libs/common/utils/parse-ms.util';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const redisUri = `redis://${config.getOrThrow<string>('REDIS_USER')}:${config.getOrThrow<string>('REDIS_PASSWORD')}@${config.getOrThrow<string>('REDIS_HOST')}:${config.getOrThrow<string>('REDIS_PORT')}`;

  const redis = new IORedis(redisUri);

  app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.use(
    session({
      secret: config.getOrThrow<string>('SESSION_SECRET'), //  секретный ключ для подписи идентификатора сессии
      name: config.getOrThrow<string>('SESSION_NAME'),
      resave: true, // указывает нужно ли сохранять сессия если она даже не была изменена
      saveUninitialized: false, // указывает нужно ли сохранять не инициализированные сессии
      cookie: {
        domain: config.getOrThrow<string>('SESSION_DOMAIN'),
        maxAge: parseMs(config.getOrThrow<string>('SESSION_MAX_AGE')),
        httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
        secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
        sameSite: 'lax',
      },
      store: new RedisStore({
        client: redis,
        prefix: config.getOrThrow<string>('SESSION_FOLDER'), //перфикс для ключей сессий в редис
      }),
    }),
  );

  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true, //так как будем работать с серверными куками
    exposedHeaders: ['set-cookie'],
  });

  await app.listen(config.getOrThrow<number>('PORT') ?? 3000, () => {
    console.log(`Server start on port: ${config.getOrThrow<string>('PORT')}`);
  });
}
bootstrap();
