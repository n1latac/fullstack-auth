import { UsersRole } from '../libs/enum';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../guards/roles.guards';
import { Roles } from './roles.decorators';
import { AuthGuard } from '../guards/auth.guard';

export function Authorization(...roles: UsersRole[]) {
  if (roles.length > 0) {
    return applyDecorators(Roles(...roles), UseGuards(AuthGuard, RolesGuard));
  }

  return applyDecorators(UseGuards(AuthGuard));
}
