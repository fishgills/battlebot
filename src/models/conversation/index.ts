import { DataTypes, Model } from 'sequelize';
import sequelize from '../../db';

class Conversation extends Model {
  public id!: string;
  public value!: string;
  public expiresAt!: string;
}

Conversation.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: 'conversations',
    sequelize: sequelize,
  },
);

export default Conversation;
