import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CharacterEntity } from 'characters/character.entity';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
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

  delete(options?: FindOptionsWhere<CombatModel> | string[]) {
    return this.combatRepo.delete(options);
  }

  findByIds(ids: string[]): Promise<CombatModel[]> {
    return this.combatRepo.findBy({
      id: In(ids),
    });
  }

  findOne(id: string, options?: FindOneOptions<CombatModel>) {
    const conditions = {
      where: {
        id: id,
      },
    };
    return this.combatRepo.findOneOrFail({ ...options, ...conditions });
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
