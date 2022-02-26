import { DiceRoll } from '@dice-roller/rpg-dice-roller';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { modifier } from 'gamerules';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CharacterEntity } from './character.entity';
import { CharacterType } from './character.type';
import { CreateCharacterInput } from './dto/create-character.dto';
import { DeleteCharacterInput } from './dto/delete-character.dto';
import { UpdateCharacterInput } from './dto/update-character.dto';
@Injectable()
export class CharacterService {
  constructor(
    @InjectRepository(CharacterEntity)
    private readonly charRepo: Repository<CharacterEntity>,
  ) {}

  create(createCharacterDto: CreateCharacterInput): Promise<CharacterType> {
    const char = this.charRepo.create(createCharacterDto);
    char.teamId = createCharacterDto.teamId;
    this.rollCharacter(char);
    char.level = 1;
    return this.charRepo.save(char);
  }

  delete(input: DeleteCharacterInput) {
    return this.charRepo.delete({
      teamId: input.teamId,
      owner: input.owner,
    });
  }

  find(options?: FindManyOptions<CharacterEntity>): Promise<CharacterType[]> {
    return this.charRepo.find(options);
  }

  findAll(): Promise<CharacterType[]> {
    return this.charRepo.find();
  }

  findAndcount(options: FindManyOptions<CharacterEntity>) {
    return this.charRepo.findAndCount(options);
  }
  findByIds(
    ids: string[],
    options?: FindManyOptions<CharacterEntity>,
  ): Promise<CharacterType[]> {
    return this.charRepo.findByIds(ids, options);
  }

  findByOwner(
    owner: string,
    teamId: string | undefined,
  ): Promise<CharacterType> {
    return this.charRepo.findOneOrFail({
      where: {
        owner,
        teamId,
      },
    });
  }

  update(id: string, input: UpdateCharacterInput) {
    return this.charRepo.update(
      {
        id,
      },
      input,
    );
  }

  findOne(options: FindOneOptions<CharacterEntity>): Promise<CharacterType> {
    return this.charRepo.findOneOrFail(options);
  }

  public rollCharacter(char: CharacterType) {
    char.strength = new DiceRoll('4d6kh3').total;
    char.defense = new DiceRoll('4d6kh3').total;
    char.vitality = new DiceRoll('4d6kh3').total;
    char.rolls = char.rolls ? ++char.rolls : 1;
    char.hp = 10 + modifier(char.vitality);
  }
}
