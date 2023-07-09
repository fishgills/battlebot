// characters.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CharacterEntity } from './entities/character.entity';
import { BaseService } from 'src/base/service';
import { DeleteCharacterInput } from './dto/delete-character.dt';
import { DiceRoll } from '@dice-roller/rpg-dice-roller';
import { modifier } from 'src/gamerules';
import { CreateCharacterDto } from './dto/create-character.dto';

@Injectable()
export class CharactersService extends BaseService<CharacterEntity> {
  constructor(
    @InjectRepository(CharacterEntity)
    protected repo: Repository<CharacterEntity>,
  ) {
    super();
    this.logger = new Logger('CharacterService');
  }
  removeFromTeam(input: DeleteCharacterInput) {
    return this.repo.delete({
      teamId: input.teamId,
      owner: input.owner,
    });
  }

  async create(dto: CreateCharacterDto) {
    const character = this.repo.create(dto);
    character.rollCharacter();
    this.repo.insert(character);
    return character;
  }

  findByOwner(
    owner: string,
    teamId: string | undefined,
  ): Promise<CharacterEntity> {
    this.logger;
    return this.repo.findOneOrFail({
      where: {
        owner,
        teamId,
      },
    });
  }
}
