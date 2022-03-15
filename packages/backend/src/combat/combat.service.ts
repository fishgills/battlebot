import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CharacterEntity } from 'characters/character.entity';
import {
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { CombatLog } from '../gamerules';
import { CombatModel } from './combat.model';
import { CreateCombatInput } from './dto/create-combat.input';

@Injectable()
export class CombatService {
  constructor(
    @InjectRepository(CombatModel) public combatRepo: Repository<CombatModel>,
    @InjectRepository(CharacterEntity)
    private charRepo: Repository<CharacterEntity>,
  ) {}

  findAll(options?: FindManyOptions<CombatModel>) {
    return this.combatRepo.find(options);
  }

  delete(options?: FindConditions<CombatModel> | string[]) {
    return this.combatRepo.delete(options);
  }

  findByIds(
    ids: string[],
    options?: FindManyOptions<CombatModel>,
  ): Promise<CombatModel[]> {
    return this.combatRepo.findByIds(ids, options);
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
}
