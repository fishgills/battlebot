import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext): any {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}

// export class GqlAuthGuard extends AuthGuard('jwt') {
//   constructor() {
//     super();
//   }

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     await super.canActivate(context);
//     const ctx = GqlExecutionContext.create(context);
//     const request = ctx.getContext();
//     request.body = ctx.getArgs();
//     return true;
//   }

//   getRequest(context: ExecutionContext) {
//     const ctx = GqlExecutionContext.create(context);
//     const request = ctx.getContext();
//     request.body = ctx.getArgs();
//     return request;
//   }
// }
