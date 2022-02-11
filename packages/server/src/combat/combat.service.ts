import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CharacterModel } from '../characters/character.model';
import { CombatLog } from '../gamerules';
import { CombatModel } from './combat.model';
import { CreateCombatInput } from './dto/create-combat.input';

@Injectable()
export class CombatService {
  constructor(
    @InjectRepository(CombatModel) public combatRepo: Repository<CombatModel>,
    @InjectRepository(CharacterModel)
    private charRepo: Repository<CharacterModel>,
  ) {}

  findAll(options?: FindManyOptions<CombatModel>) {
    return this.combatRepo.find(options);
  }

  findOne(id: string, options?: FindOneOptions<CombatModel>) {
    return this.combatRepo.findOneOrFail(id, options);
  }

  update(id: string, combat: CombatModel) {
    return this.combatRepo.update(
      {
        id,
      },
      combat,
    );
  }
  updateLog(combatId: string, log: CombatLog) {
    return this.combatRepo.update(
      {
        id: combatId,
      },
      {
        log,
      },
    );
  }

  create(input: CreateCombatInput) {
    return this.combatRepo.save({
      attackerId: input.attackerId,
      defenderId: input.defenderId,
    });
  }

  getXP(attacker: CharacterModel, defender: CharacterModel) {
    const base = 10;
    const diff = attacker.level - defender.level;
  }
}
