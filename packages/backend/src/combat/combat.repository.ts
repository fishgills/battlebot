import { Repository } from 'typeorm';
import { CombatEntity } from './entities/combat.entity';
import { EntityRepository } from 'typeorm';

@EntityRepository(CombatEntity)
export class CombatRepository extends Repository<CombatEntity> {}
