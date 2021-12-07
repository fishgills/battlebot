import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CharacterModule } from './character/character.module';
import { BattleModule } from './battle/battle.module';
import { ParticipantModule } from './participant/participant.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      username: 'admin',
      password: 'botpassword',
      database: 'botdb',
      host: 'bot-db-mysql.czt8rqiogmyl.us-west-1.rds.amazonaws.com',
      port: 3306,
      dropSchema: false,
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    CharacterModule,
    BattleModule,
    ParticipantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
