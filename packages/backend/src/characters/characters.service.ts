// characters.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CharacterEntity } from './entities/character.entity';
import { BaseService } from 'src/base/service';
import { DeleteCharacterInput } from './dto/delete-character.dt';

@Injectable()
export class CharactersService extends BaseService<CharacterEntity> {
  constructor(
    @InjectRepository(CharacterEntity)
    repo: Repository<CharacterEntity>,
  ) {
    super(repo);
  }
  removeFromTeam(input: DeleteCharacterInput) {
    return this.repo.delete({
      teamId: input.teamId,
      owner: input.owner,
    });
  }

  findByOwner(
    owner: string,
    teamId: string | undefined,
  ): Promise<CharacterEntity> {
    return this.repo.findOneOrFail({
      where: {
        owner,
        teamId,
      },
    });
  }
}
