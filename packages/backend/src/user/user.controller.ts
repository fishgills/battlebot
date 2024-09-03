import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './DTO/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() body: CreateUserDTO) {
    return this.userService.createUser(body.username, body.password);
  }

  @Get(':id')
  async getUser(@Param('id') id: number) {
    return this.userService.findUserById(id);
  }

  @Get()
  async getUsers() {
    return this.userService.findAllUsers();
  }
}
