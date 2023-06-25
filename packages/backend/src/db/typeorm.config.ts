import 'dotenv/config';
import { DataSource } from 'typeorm';
import { CharacterEntity } from '../characters/entities/character.entity';
import { CombatEntity } from '../combat/entities/combat.entity';

export default new DataSource({
  logging: true,
  type: 'mysql',
  ...(process.env.INSTANCE_UNIX_SOCKET && {
    socketPath: process.env.INSTANCE_UNIX_SOCKET,
  }),
  ...(process.env.DB_HOST && { host: process.env.host }),
  port: 3306,
  migrationsRun: true,
  migrations: ['./migrations/*{.ts,.js}'],
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'botdb',
  entities: [CharacterEntity, CombatEntity],
});
