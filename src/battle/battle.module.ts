import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Module } from '@nestjs/common';
import { ParticipantEntity } from 'src/participant/participant.entity';
import { BattleAssembler } from './battle.assembler';
import { BattleDto } from './battle.dto';
import { BattleEntity } from './battle.entity';
import { BattleResolver } from './battle.resolvers';
import { BattleService } from './battle.service';

@Module({
  providers: [BattleResolver],
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature([BattleEntity]),
        NestjsQueryTypeOrmModule.forFeature([ParticipantEntity]),
      ],
      dtos: [{ DTOClass: BattleDto }],
      // services: [BattleService],
      // assemblers: [BattleAssembler],
      // resolvers: [
      // {
      // DTOClass: BattleDto,
      // EntityClass: BattleEntity,
      // ServiceClass: BattleService,
      // AssemblerClass: BattleAssembler,
      // },
      // ],
    }),
  ],
})
export class BattleModule {}
