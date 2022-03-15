import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { jwtConstants } from 'auth/constant';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'users/users.service';
import { UserType } from 'users/users.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private service: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  validate(payload: UserType) {
    return this.service.findOne(payload.username);
  }
}
