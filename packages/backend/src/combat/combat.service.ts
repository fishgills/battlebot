// characters.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CombatEntity } from './entities/combat.entity';
import { BaseService } from 'src/base/service';

@Injectable()
export class CombatService extends BaseService<CombatEntity> {
  constructor(
    @InjectRepository(CombatEntity)
    repo: Repository<CombatEntity>,
  ) {
    super(repo);
  }
}
