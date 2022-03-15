import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'auth/roles/role.enum';
import { Repository } from 'typeorm';
import { UserEntity } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  findOne(username: string) {
    return this.repo.findOne({ username });
  }

  async create(username: string, password: string, role: Role) {
    const user = await this.repo.create({
      username,
      password,
      role,
    });

    await this.repo.save(user);
    return user;
  }
}
