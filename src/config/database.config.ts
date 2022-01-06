import { CharacterModel } from 'src/characters/character.model';
import { CombatModel } from 'src/combat/combat.model';
import { RewardModel } from 'src/rewards/reward.model';
import { SlackInstallModel } from 'src/installs/install.model';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export const database: MysqlConnectionOptions = {
  type: 'mysql',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'botdb',
  host: process.env.DB_HOST,
  port: 3306,
  dropSchema: false,
  synchronize: true,
  logging: true,
  cache: true,
  entities: [CombatModel, CharacterModel, SlackInstallModel, RewardModel],
};
