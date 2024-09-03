import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CharacterModule } from './character/character.module';
import { UserModule } from './user/user.module';
import { LoggerModule } from 'nestjs-pino';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvalidModule } from 'nestjs-envalid';
import { env, validators } from './config/config.module';

@Module({
  imports: [
    EnvalidModule.forRoot({ validators }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      logging: !env.isProduction,
      host: env.DB_HOST,
      port: env.DB_PORT,
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      database: env.DB,
      autoLoadEntities: true,
      synchronize: env.isProduction ? false : true,
    }),
    CharacterModule,
    UserModule,
    // LoggerModule.forRoot({
    //   pinoHttp: {
    //     level: env.isProduction ? 'info' : 'debug',
    //   },
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
