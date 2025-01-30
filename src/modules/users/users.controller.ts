import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { Authorized } from '../../decorators/authorized.decorators';
import { Authorization } from '../../decorators/auth.decorators';
import { UsersRole } from '../../libs/enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  public async getProfile(@Authorized('id') userId: number) {
    return await this.usersService.findById(userId);
  }

  @Authorization(UsersRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('by-id/:id')
  public async getUserById(@Param('id') userId: number) {
    console.log({ userId });
    return await this.usersService.findById(userId);
  }
}
