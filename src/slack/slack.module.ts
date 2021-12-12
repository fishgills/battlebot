import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Module } from '@nestjs/common';
import { SlackDto } from './slack.dto';
import { SlackEntity } from './slack.entity';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([SlackEntity])],
      resolvers: [
        {
          DTOClass: SlackDto,
          EntityClass: SlackEntity,
        },
      ],
    }),
  ],
})
export class SlackModule {}
