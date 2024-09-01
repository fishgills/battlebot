// characters.service.ts
import { Injectable, Logger } from '@nestjs/common';
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
    protected repo: Repository<CombatEntity>,
  ) {
    super(repo, new Logger('CombatService'));
  }

  create(input: CreateCombatDto): Promise<CombatEntity> {
    return this.repo.save({
      attackerId: input.attackerId,
      defenderId: input.defenderId,
    });
  }

  findOne(options: FindOneOptions<CombatEntity>) {
    return this.repo.findOneOrFail(options);
  }

  // findOne(id: string, options?: FindOneOptions<CombatEntity>) {
  //   const conditions = {
  //     where: {
  //       id: id,
  //     },
  //   };
  //   return this.repo.findOneOrFail({
  //     ...conditions,
  //   });
  // }
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
