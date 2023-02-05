import { SessionModel } from '../slack-auth/session-model';
import { CombatModel } from '../combat/combat.model';
import { SlackInstallModel } from '../installs/install.model';
import { CharacterEntity } from '../characters/character.entity';
import { RewardEntity } from '../rewards/reward.entity';
import { ConvoEntity } from '../convostore/convo.entity';
import { UserEntity } from '../users/users.entity';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export const database: MysqlConnectionOptions = {
  type: 'mysql',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  dropSchema: false,
  synchronize: false,
  migrationsRun: false,
  cache: false,
  migrations: [`${__dirname}/migrations/*.{ts,js}`],
  migrationsTableName: 'history',
  // cli: {
  //   migrationsDir: `${__dirname}/migrations`,
  // },

  entities: [
    CombatModel,
    CharacterEntity,
    SlackInstallModel,
    RewardEntity,
    SessionModel,
    ConvoEntity,
    UserEntity,
  ],
};
