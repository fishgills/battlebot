import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Module } from '@nestjs/common';
import { ParticipantDto } from './participant.dto';
import { ParticipantEntity } from './participant.entity';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([ParticipantEntity])],
      resolvers: [
        {
          DTOClass: ParticipantDto,
          EntityClass: ParticipantEntity,
        },
      ],
    }),
  ],
})
export class ParticipantModule {}
