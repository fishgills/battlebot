import { DataTypes, Model } from 'sequelize';
import sequelize from '../../db';
import Abilities from '../abilities';

class Character extends Model {
  public id!: number;
  public name!: string;
  public owner?: string;
  public abilitilesId!: number;
  public abilities!: Abilities;
}

Character.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: 'character',
    sequelize: sequelize,
  },
);

export default Character;
