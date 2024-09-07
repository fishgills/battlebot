import { registerAs } from '@nestjs/config';
import { env } from './config.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { resolve } from 'path';

console.log(resolve(__dirname, '../**/*.entity{.ts,.js}'));

const config = {
  type: 'mysql',
  logging: !env.isProduction,
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB,
  autoLoadEntities: true,
  migrationsRun: true,
  entities: [resolve(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
  dropSchema: false,
};

export default registerAs('typeorm', () => config);

export const connectionSource = new DataSource(config as DataSourceOptions);
