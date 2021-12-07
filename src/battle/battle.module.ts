import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Module } from '@nestjs/common';
import { BattleDto } from './battle.dto';
import { BattleEntity } from './battle.entity';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([BattleEntity])],
      resolvers: [{ DTOClass: BattleDto, EntityClass: BattleEntity }],
    }),
  ],
})
export class BattleModule {}
