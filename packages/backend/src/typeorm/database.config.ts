import { SessionModel } from '../slack-auth/session-model';
import { CombatModel } from '../combat/combat.model';
import { SlackInstallModel } from '../installs/install.model';
import { CharacterEntity } from '../characters/character.entity';
import { RewardEntity } from '../rewards/reward.entity';
import { ConvoEntity } from '../convostore/convo.entity';
import { UserEntity } from '../users/users.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const database: PostgresConnectionOptions = {
  type: 'postgres',
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
