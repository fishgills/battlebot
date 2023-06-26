// characters.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CharacterEntity } from './entities/character.entity';
import { BaseService } from 'src/base/service';
import { DeleteCharacterInput } from './dto/delete-character.dt';
import { DiceRoll } from '@dice-roller/rpg-dice-roller';
import { modifier } from 'src/gamerules';

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
  public rollCharacter(char: CharacterEntity) {
    char.strength = new DiceRoll('4d6kh3').total;
    char.defense = new DiceRoll('4d6kh3').total;
    char.vitality = new DiceRoll('4d6kh3').total;
    char.rolls = char.rolls ? ++char.rolls : 1;
    char.hp = 10 + modifier(char.vitality);
  }
}
