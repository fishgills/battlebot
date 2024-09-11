import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    this.logger.warn(`handleRequest: ${JSON.stringify(info)}`);
    if (err || !user) {
      this.logger.warn(
        `Unauthorized access attempt: ${info?.message || 'No user'}`,
      );
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
