import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../database/models/User.entity';
import { AuthMethods } from '../../libs/enum';
import { hash } from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly usersRepo: typeof User,
  ) {}

  public async findById(id: string) {
    const user = await this.usersRepo.findOne({
      where: {
        id,
      },
      include: [{ association: 'accounts' }],
    });

    // if (!user) {
    //   throw new NotFoundException('Пользователь не найден.');
    // }

    return user;
  }

  public async findByEmail(email: string) {
    const user = await this.usersRepo.findOne({
      where: {
        email,
      },
      include: [{ association: 'accounts' }],
    });

    // if (!user) {
    //   throw new NotFoundException('Пользователь не найден.');
    // }

    return user;
  }

  public async create(
    email: string,
    password: string,
    displayName: string,
    picture: string,
    method: AuthMethods,
    isVerified: boolean,
  ) {
    const hashedPassword = password ? await hash(password) : false;
    if (!hashedPassword) {
      throw new Error('Пароль обязателен.');
    }

    const user = await this.usersRepo.create(
      {
        email,
        password: hashedPassword,
        display_name: displayName,
        image_src: picture,
        auth_method: method,
        is_verified: isVerified,
      },
      { include: [{ association: 'accounts' }] },
    );

    return user;
  }
}
