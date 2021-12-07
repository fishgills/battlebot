import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Module } from '@nestjs/common';
import { CharacterDto } from './character.dto';
import { CharacterEntity } from './character.entity';
import { CharacterService } from './character.service';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([CharacterEntity])],
      services: [CharacterService],
      resolvers: [
        {
          DTOClass: CharacterDto,
          EntityClass: CharacterEntity,
        },
      ],
    }),
  ],
})
export class CharacterModule {}
