import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CharacterModel } from 'src/characters/character.model';
import { Repository } from 'typeorm';
import { CombatModel } from './combat.model';
import { CreateCombatInput } from './dto/create-combat.input';

@Injectable()
export class CombatService {
  constructor(
    @InjectRepository(CombatModel) public combatRepo: Repository<CombatModel>,
    @InjectRepository(CharacterModel)
    private charRepo: Repository<CharacterModel>,
  ) {}

  findAll() {
    return this.combatRepo.find({
      relations: ['participants'],
    });
  }

  async create() {
    return await this.combatRepo.save({});
  }

  async addToCharacter(combatId: string, charId: string) {
    let foundCombat = await this.combatRepo.findOne(
      {
        id: combatId,
      },
      {
        relations: ['participants'],
      },
    );
    let foundCharacter = await this.charRepo.findOne({
      id: charId,
    });

    if (foundCombat && foundCharacter) {
      foundCombat.participants.push(foundCharacter);
      return this.combatRepo.save(foundCombat);
    } else {
      throw new Error(`Couldn't add combat to character`);
    }
  }
}
