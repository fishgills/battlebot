import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CharacterModule } from './character/character.module';
import { BattleModule } from './battle/battle.module';
import { ParticipantModule } from './participant/participant.module';
import { SlackModule } from './slack/slack.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'botdb',
      host: process.env.DB_HOST,
      port: 3306,
      dropSchema: false,
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      introspection: true,
    }),
    CharacterModule,
    BattleModule,
    ParticipantModule,
    SlackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
