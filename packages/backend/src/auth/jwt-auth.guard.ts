import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      this.logger.warn(
        `Unauthorized access attempt: ${info?.message || 'No user'}`,
      );
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
