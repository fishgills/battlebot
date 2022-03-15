import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'users/users.service';
import * as bcrypt from 'bcrypt';
import { UserType } from 'users/users.type';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<Partial<UserType>> {
    const user = await this.userService.findOne(username);
    if (!user) return null;

    const result = bcrypt.compareSync(pass, user.password);

    if (!result) return null;

    const { password, ...partialUser } = user;
    return partialUser;
  }

  login(user: UserType): { token: string } {
    const payload = { username: user.username, sub: user.id };
    return { token: this.jwtService.sign(payload) };
  }
}
