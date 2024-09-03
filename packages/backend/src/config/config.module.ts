import { Module } from '@nestjs/common';
import * as envalid from 'envalid';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { makeValidators, Static } from 'nestjs-envalid';

const spec = {
  PORT: envalid.port({
    default: 3000,
  }),
  DB_HOST: envalid.str({
    default: 'localhost',
  }),
  DB_PORT: envalid.port({
    default: 3306,
  }),
  DB_USERNAME: envalid.str({
    default: 'root',
  }),
  DB_PASSWORD: envalid.str({
    default: 'bot',
  }),
  DB: envalid.str({
    default: 'botdb',
  }),
};

export const env = envalid.cleanEnv(process.env, spec);

export const validators = makeValidators(spec);

export type Config = Static<typeof validators>;

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//       validate: () => env,
//     }),
//   ],
//   providers: [
//     {
//       provide: 'CONFIG',
//       useValue: env,
//     },
//   ],
//   exports: [ConfigService, 'CONFIG'],
// })
// export class MyConfigModule {}
