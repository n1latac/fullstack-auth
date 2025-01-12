import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { AuthMethods, UsersRole } from '../../libs/enum';
import { Account } from './Account.entity';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  display_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  image_src?: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_verified: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_two_factor_enabled: boolean;

  @Column({
    type: DataType.ENUM(...Object.values(AuthMethods)),
    allowNull: true,
  })
  auth_method: string;

  @Column({
    type: DataType.ENUM(...Object.values(UsersRole)),
    defaultValue: UsersRole.REGULAR,
  })
  role: string;

  @HasMany(() => Account)
  accounts: Account[];
}
