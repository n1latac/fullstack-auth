import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UsersService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (typeof request.session.userId === 'undefined') {
      throw new UnauthorizedException(
        'Пользователь не авторизован. Пожалуйста войдите в систему что-бы авторизоваться.',
      );
    }

    const user = await this.userService.findById(request.session.userId);

    if (!user) {
      throw new UnauthorizedException(
        'Пользователь не найден. Убедитесь что вы используете правильные данные.',
      );
    }

    request.user = user;

    return true;
  }
}
