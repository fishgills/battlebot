import { DiceRoll } from '@dice-roller/rpg-dice-roller';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CombatModel } from 'src/combat/combat.model';
import { modifier } from 'src/dnd';
import { Repository } from 'typeorm';
import { CharacterModel } from './character.model';
import { CreateCharacterInput } from './create-character.dto';
@Injectable()
export class CharacterService {
  constructor(
    @InjectRepository(CharacterModel)
    private readonly charRepo: Repository<CharacterModel>,
    @InjectRepository(CombatModel)
    private readonly combatRepo: Repository<CombatModel>,
  ) {}

  create(createCharacterDto: CreateCharacterInput): Promise<CharacterModel> {
    const char = this.charRepo.create(createCharacterDto);
    this.rollCharacter(char);
    char.level = 1;
    return this.charRepo.save(char);
  }

  findAll(): Promise<CharacterModel[]> {
    return this.charRepo.find();
  }

  findByIds(ids: string[]) {
    return this.charRepo.findByIds(ids);
  }

  findByOwner(owner: string) {
    return this.charRepo.findOneOrFail({
      where: {
        owner,
      },
    });
  }

  update(id: string, input: CreateCharacterInput) {
    return this.charRepo.update(
      {
        id,
      },
      input,
    );
  }

  findOne(id: string) {
    return this.charRepo.findOne(id);
  }

  async addToCombat(charId: string, combatId: string) {
    let foundCharacter = await this.charRepo.findOne(
      {
        id: charId,
      },
      {
        relations: ['combats'],
      },
    );
    let foundCombat = await this.combatRepo.findOne({ id: combatId });

    if (foundCombat && foundCharacter) {
      foundCharacter.combats.push(foundCombat);
      return this.charRepo.save(foundCharacter);
    }
  }

  public rollCharacter(char: CharacterModel) {
    char.str = new DiceRoll('4d6kh3').total;
    char.dex = new DiceRoll('4d6kh3').total;
    char.con = new DiceRoll('4d6kh3').total;
    char.rolls = char.rolls ? ++char.rolls : 1;
    char.hp = 10 + modifier(char.con);
  }
}
