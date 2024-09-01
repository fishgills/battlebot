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
    super(repo, new Logger('CharacterService'));
  }
  removeFromTeam(input: DeleteCharacterInput) {
    return this.repo.delete({
      teamId: input.teamId,
      owner: input.owner,
    });
  }

  async create(dto: CreateCharacterDto) {
    let character = await super.create(dto);
    character = this.rollCharacter(character);
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

  rollCharacter(char: CharacterEntity) {
    char.strength = new DiceRoll('4d6kh3').total;
    char.defense = new DiceRoll('4d6kh3').total;
    char.vitality = new DiceRoll('4d6kh3').total;
    char.rolls = char.rolls ? ++char.rolls : 1;
    char.hp = 10 + modifier(char.vitality);
    return char;
  }
}
