import { SessionModel } from '../slack-auth/session-model';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { CombatModel } from '../combat/combat.model';
import { SlackInstallModel } from '../installs/install.model';
import { CharacterEntity } from '../characters/character.entity';
import { RewardEntity } from '../rewards/reward.entity';
import { ConvoEntity } from '../convostore/convo.entity';
import { UserEntity } from '../users/users.entity';

export const database: MysqlConnectionOptions = {
  type: 'mysql',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'botdb',
  host: process.env.DB_HOST,
  port: 3306,
  dropSchema: false,
  synchronize: false,
  migrationsRun: false,
  logging: process.env.NODE_ENV !== 'production',
  cache: false,
  migrations: [`${__dirname}/migrations/*.{ts,js}`],
  cli: {
    migrationsDir: `${__dirname}/migrations`,
  },
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
