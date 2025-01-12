import { UsersRole } from '../libs/enum';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UsersRole[]) => SetMetadata(ROLES_KEY, roles);
