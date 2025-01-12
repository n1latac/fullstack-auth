import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './User.entity';

@Table({ tableName: 'accounts', timestamps: true })
export class Account extends Model<Account> {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  type: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  provider: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  refresh_token?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  access_token?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  expires_at: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @BelongsTo(() => User)
  user: User;
}
