import { Mutation, Resolver, GqlExecutionContext, Args } from '@nestjs/graphql';
import {
  createParamDecorator,
  ExecutionContext,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from 'auth/guards/local-auth.guard';
import { UsersService } from 'users/users.service';
import { UserType } from 'users/users.type';
import { AuthService } from 'auth/auth.service';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext();
    request.body = ctx.getArgs();
    return request.user;
  },
);

@Resolver('App')
export class AuthResolver {
  constructor(
    @Inject(UsersService) private service: UsersService,
    @Inject(AuthService) private authService: AuthService,
  ) {}
  //   @UseGuards(LocalAuthGuard)
  //   @Mutation((returns) => String)
  //   public async login(
  //     @CurrentUser() req: UserType,
  //     @Args('username') username: string,
  //     @Args('password') password: string,
  //   ): Promise<string> {
  //     return this.authService.login(req);
  //   }

  @Mutation((returns) => UserType)
  public async create(
    @Args('username') username: string,
    @Args('password') password: string,
  ) {
    return this.service.create(username, password);
  }
}
