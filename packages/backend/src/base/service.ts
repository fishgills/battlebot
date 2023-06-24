// base.service.ts
import { DeepPartial, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BaseEntity } from './entity';
@Injectable()
export class BaseService<BaseEntity> {
  constructor(private readonly repository: Repository<BaseEntity>) {}

  findAll(): Promise<BaseEntity[]> {
    return this.repository.find();
  }

  findOne(id: string): Promise<BaseEntity> {
    return this.repository.findOneById(id);
  }

  remove(id: string) {
    return this.repository.delete(id);
  }

  create(entity: DeepPartial<BaseEntity>): Promise<BaseEntity> {
    return this.repository.save(entity);
  }

  update(id: any, entity: Partial<BaseEntity>) {
    return this.repository.save(id, entity);
  }
}
