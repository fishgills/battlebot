import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from 'users/users.service';

@Injectable()
export class CreateUserGuard implements CanActivate {
  constructor(private service: UsersService) {}
  async canActivate(context: ExecutionContext) {
    const user = await this.service.findOne('bot');
    if (user) {
      return false;
    }

    return true;
  }
}
