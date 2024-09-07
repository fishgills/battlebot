import { Module } from '@nestjs/common';
import * as envalid from 'envalid';
import { EnvalidModule, makeValidators, Static } from 'nestjs-envalid';

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
  JWT_SECRET: envalid.str({
    default: 'dev-secret',
  }),
  GOOGLE_CLIENT_ID: envalid.str({
    default: 'google_client_id',
  }),
  GOOGLE_CLIENT_SECRET: envalid.str({
    default: 'google_client_secret',
  }),
};

export const env = envalid.cleanEnv(process.env, spec);

export const validators = makeValidators(spec);

export type Config = Static<typeof validators>;

@Module({
  imports: [EnvalidModule.forRoot({ validators })],
  exports: [EnvalidModule],
})
export class MyConfigModule {}

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
