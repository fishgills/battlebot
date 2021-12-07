import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CharacterEntity } from './character.entity';

@QueryService(CharacterEntity)
export class CharacterService extends TypeOrmQueryService<CharacterEntity> {
  constructor(
    @InjectRepository(CharacterEntity) repo: Repository<CharacterEntity>,
  ) {
    super(repo, {
      useSoftDelete: true,
    });
  }
}
