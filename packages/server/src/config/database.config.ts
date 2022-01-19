import { SessionModel } from 'src/auth/session-model';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { CharacterModel } from '../characters/character.model';
import { CombatModel } from '../combat/combat.model';
import { SlackInstallModel } from '../installs/install.model';
import { RewardModel } from '../rewards/reward.model';

export const database: MysqlConnectionOptions = {
  type: 'mysql',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'botdb',
  host: process.env.DB_HOST,
  port: 3306,
  dropSchema: true,
  synchronize: true,
  logging: true,
  cache: true,
  entities: [
    CombatModel,
    CharacterModel,
    SlackInstallModel,
    RewardModel,
    SessionModel,
  ],
};
