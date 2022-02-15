import { DiceRoll } from '@dice-roller/rpg-dice-roller';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { modifier } from 'gamerules';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CharacterModel } from './character.model';
import { CreateCharacterInput } from './create-character.dto';
@Injectable()
export class CharacterService {
  constructor(
    @InjectRepository(CharacterModel)
    private readonly charRepo: Repository<CharacterModel>,
  ) {}

  create(createCharacterDto: CreateCharacterInput): Promise<CharacterModel> {
    const char = this.charRepo.create(createCharacterDto);
    char.teamId = createCharacterDto.teamId;
    this.rollCharacter(char);
    char.level = 1;
    return this.charRepo.save(char);
  }

  find(options?: FindManyOptions<CharacterModel>) {
    return this.charRepo.find(options);
  }

  findAll(): Promise<CharacterModel[]> {
    return this.charRepo.find();
  }

  findByIds(ids: string[]) {
    return this.charRepo.findByIds(ids);
  }

  findByOwner(owner: string, teamId: string | undefined) {
    return this.charRepo.findOneOrFail({
      where: {
        owner,
        teamId,
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

  findOne(options: FindOneOptions<CharacterModel>) {
    return this.charRepo.findOneOrFail(options);
  }

  public rollCharacter(char: CharacterModel) {
    char.strength = new DiceRoll('4d6kh3').total;
    char.defense = new DiceRoll('4d6kh3').total;
    char.vitality = new DiceRoll('4d6kh3').total;
    char.rolls = char.rolls ? ++char.rolls : 1;
    char.hp = 10 + modifier(char.vitality);
  }
}
