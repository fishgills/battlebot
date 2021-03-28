import { KnownBlock } from '@slack/types';
import { FileSystemCredentials } from 'aws-sdk';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../../db';
import { titleCase } from '../../utils/helpers';

class Abilities extends Model {
  public id!: number;
  public dex!: number;
  public str!: number;
  public con!: number;

  public form() {
    const fields: KnownBlock[] = [
      {
        type: 'section',
        text: {
          text: `Strength: *${this.str}*`,
          type: 'mrkdwn',
        },
      },
      {
        type: 'section',
        text: {
          text: `Constitution: *${this.con}*`,
          type: 'mrkdwn',
        },
      },
      {
        type: 'section',
        text: {
          text: `Dexterity: *${this.dex}*`,
          type: 'mrkdwn',
        },
      },
    ];
    return fields;
  }
}
Abilities.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dex: {
      type: DataTypes.INTEGER,
    },
    str: {
      type: DataTypes.INTEGER,
    },
    con: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: 'abilities',
    sequelize: sequelize,
  },
);

export default Abilities;
