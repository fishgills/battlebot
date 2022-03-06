import { Mutation, Resolver, GqlExecutionContext, Args } from '@nestjs/graphql';
import { createParamDecorator, ExecutionContext, Inject } from '@nestjs/common';
import { UsersService } from 'users/users.service';
import { UserType } from 'users/users.type';
import { AuthService } from 'auth/auth.service';

export const CurrentUser = createParamDecorator<
  unknown,
  ExecutionContext,
  UserType
>((data, context) => {
  const ctx = GqlExecutionContext.create(context);
  const request = ctx.getContext().req;
  // request.body = ctx.getArgs();
  return request.user;
});

@Resolver('App')
export class AuthResolver {
  constructor(
    @Inject(UsersService) private service: UsersService,
    @Inject(AuthService) private authService: AuthService,
  ) {}

  @Mutation((returns) => UserType)
  public async create(
    @Args('username') username: string,
    @Args('password') password: string,
  ) {
    return this.service.create(username, password);
  }
}
