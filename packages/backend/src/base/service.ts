import { Logger } from '@nestjs/common';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class BaseService<T> {
  protected constructor(
    protected readonly repository: Repository<T>,
    protected readonly logger: Logger,
  ) {}

  async create(entity: DeepPartial<T>) {
    this.logger.debug(`Creating entity`);
    return await this.repository.save(entity);
  }

  async findOne(options: FindOneOptions<T>) {
    this.logger.debug(`Finding one ${options}`);
    return this.repository.findOne(options);
  }

  async findAll() {
    this.logger.debug(`Finding all`);
    return this.repository.find();
  }

  async update(id: string, entity: QueryDeepPartialEntity<T>) {
    this.logger.debug(`Updating ${id}`);
    return this.repository.update(id, entity as QueryDeepPartialEntity<T>);
  }

  async delete(id: string) {
    this.logger.debug(`Deleting ${id}`);
    await this.repository.delete(id);
  }
}
