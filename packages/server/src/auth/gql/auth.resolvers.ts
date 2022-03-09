import { Mutation, Resolver, GqlExecutionContext, Args } from '@nestjs/graphql';
import {
  createParamDecorator,
  ExecutionContext,
  Inject,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from 'users/users.service';
import { UserType } from 'users/users.type';
import { AuthService } from 'auth/auth.service';
import { Role } from 'auth/roles/role.enum';
import { Public } from 'auth/make-public';
import { CreateUserGuard } from 'auth/guards/create-user.guard';
import { LocalAuthGuard } from 'auth/guards/local-auth.guard';

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
  @UseGuards(CreateUserGuard)
  @Public()
  public async create(
    @Args('username') username: string,
    @Args('password') password: string,
  ) {
    return this.service.create(username, password, Role.Bot);
  }

  @Mutation((returns) => String)
  @Public()
  @UseGuards(LocalAuthGuard)
  login(@Req() req) {
    return this.authService.login(req.user as UserType);
  }
}
