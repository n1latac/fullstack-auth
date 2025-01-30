import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../database/models/User.entity';

export const Authorized = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const request = ctx?.switchToHttp()?.getRequest();
    const user = request?.user;

    return data ? user[data] : user;
  },
);

// 1)var
// @Authorized() user: User

// 2var
// @Authorized('id') id: string
