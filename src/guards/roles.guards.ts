import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);
    const request = context.switchToHttp().getRequest();

    if (!roles) return true;

    if (!roles.includes(request.user.role)) {
      throw new ForbiddenException(
        'Недостаточно прав. У вас нет прав доступа к этому ресурсу.',
      );
    }

    return true;
  }
}
