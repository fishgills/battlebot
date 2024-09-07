import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { env } from 'src/config/config.module';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name); // Add Logger

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    if (!payload) {
      this.logger.warn(`Failed token validation: Invalid token`);
      throw new UnauthorizedException('Invalid token');
    }

    return { clientId: payload.clientId, name: payload.name };
  }

  handleError(error: any) {
    this.logger.error(`JWT Validation Failed`, error);
    throw new UnauthorizedException();
  }
}
