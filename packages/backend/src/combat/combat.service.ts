// characters.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CombatEntity } from './entities/combat.entity';
import { BaseService } from 'src/base/service';
import { CreateCombatDto } from './dto/create-combat.dto';
import { CombatLog } from 'src/gamerules';

@Injectable()
export class CombatService extends BaseService<CombatEntity> {
  constructor(
    @InjectRepository(CombatEntity)
    repo: Repository<CombatEntity>,
  ) {
    super(repo);
  }

  create(input: CreateCombatDto): Promise<CombatEntity> {
    return this.repo.save({
      attackerId: input.attackerId,
      defenderId: input.defenderId,
    });
  }

  findOne(id: string, options?: FindOneOptions<CombatEntity>) {
    const conditions = {
      where: {
        id: id,
      },
    };
    return this.repo.findOneOrFail({
      ...conditions,
    });
  }
  updateLog(combatId: string, log: CombatLog) {
    return this.repo.update(
      {
        id: combatId,
      },
      {
        log,
      },
    );
  }
}
