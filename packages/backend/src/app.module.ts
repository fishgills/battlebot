import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CharacterModule } from './character/character.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { env } from './config/config.module';

import { PrettyOptions } from 'pino-pretty';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: false,
        level: env.isProduction ? 'info' : 'debug',
        transport: !env.isProduction
          ? {
              target: 'pino-pretty',
              options: {
                singleLine: true,
              } as PrettyOptions,
            }
          : undefined,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    AuthModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    CharacterModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
