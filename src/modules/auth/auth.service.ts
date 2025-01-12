import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDTO, RegisterDTO } from './auth.dto';
import { UsersService } from '../users/users.service';
import { AuthMethods } from '../../libs/enum';
import { User } from '../../database/models/User.entity';
import { request, Request, Response } from 'express';
import { verify } from 'argon2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}
  public async register(req: Request, data: RegisterDTO) {
    const { email, password, name, passwordRepeat } = data;
    const isExist = await this.userService.findByEmail(email);

    if (isExist) {
      throw new ConflictException(`Пользователь с такми email уже существует.`);
    }

    const user = await this.userService.create(
      email,
      password,
      name,
      '',
      AuthMethods.CREDENTIALS,
      false,
    );

    await this.saveSession(req, user);

    return user;
  }
  public async login(req: Request, data: LoginDTO) {
    const { email, password } = data;

    const user = await this.userService.findByEmail(email);

    if (!user && !user?.password) {
      throw new NotFoundException(
        'Пользователь не найден. Пожалуйста проверьте введенные данные',
      );
    }

    const isValidPassword = await verify(user.password, password);

    if (!isValidPassword) {
      throw new UnauthorizedException(
        'Неверный пароль. Пожалуйста попробуйте еще раз или восстановите пароль, если забыли его.',
      );
    }

    return await this.saveSession(req, user);
  }
  public async logout(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              'Не удалось завершить сессию. Возможно возникла проблема с сервером или сессия уже была завершена.',
            ),
          );
        }

        res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));

        res.status(200).json({ message: 'Вы успешно вышли из системы' });

        resolve();
      });
    });
  }

  private async saveSession(req: Request, user: User) {
    return new Promise((resolve, reject) => {
      req.session.userId = user.id;

      req.session.save((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              'Не удалось сохранить сессию. Проверьте, правильно ли настроены параметры сессии.',
            ),
          );
        }

        resolve({ user });
      });
    });
  }
}
