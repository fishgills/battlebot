import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    protected usersRepository: Repository<User>,
  ) {}

  async createUser(username: string, password: string): Promise<User> {
    const user = this.usersRepository.create({ username, password });
    return this.usersRepository.save(user);
  }

  async findUserById(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findUserByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }
}
