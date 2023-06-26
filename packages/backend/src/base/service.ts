// base.service.ts
import { DeepPartial, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BaseEntity } from './entity';
@Injectable()
export class BaseService<BaseEntity> {
  constructor(protected repo: Repository<BaseEntity>) {}

  findAll(): Promise<BaseEntity[]> {
    return this.repo.find();
  }

  findOne(id: string): Promise<BaseEntity> {
    return this.repo.findOneById(id);
  }

  remove(id: string) {
    return this.repo.delete(id);
  }

  create(entity: DeepPartial<BaseEntity>): Promise<BaseEntity> {
    return this.repo.save(entity);
  }

  update(id: any, entity: Partial<BaseEntity>) {
    return this.repo.save(id, entity);
  }
}
