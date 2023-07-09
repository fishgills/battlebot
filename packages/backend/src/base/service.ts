// base.service.ts
import { DeepPartial, ObjectLiteral, Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

export abstract class BaseService<T extends ObjectLiteral> {
  protected repo: Repository<T>;
  protected logger: Logger;

  findAll(): Promise<T[]> {
    return this.repo.find();
  }
  /**
   *
   * @param id UUID of Entity
   * @returns
   */
  findOne(id: string): Promise<T> {
    this.logger.debug(`Finding ${id}`);
    return this.repo.findOneById(id);
  }

  remove(id: string) {
    this.logger.debug(`Removing ${id}`);
    return this.repo.delete(id);
  }

  async create(dto: DeepPartial<T>) {
    const entity = this.repo.create(dto);
    this.repo.insert(entity);
    return entity;
  }

  update(id: any, entity: DeepPartial<T>) {
    this.logger.debug(`Updating ${id}`);
    return this.repo.update(id, entity);
  }
}
