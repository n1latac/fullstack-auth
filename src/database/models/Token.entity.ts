import { Column, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { TokenType } from '../../libs/enum';

@Table({ tableName: 'tokens', timestamps: true })
export class Token extends Model<Token> {
  @Column({
    type: DataTypes.STRING,
    allowNull: true,
  })
  email: string;

  @Column({
    type: DataTypes.STRING,
    unique: true,
  })
  token: string;

  @Column({
    type: DataTypes.ENUM(...Object.values(TokenType)),
    allowNull: true,
  })
  type: TokenType;

  @Column({
    type: DataTypes.DATE,
    allowNull: true,
  })
  expires_in: Date;
}
