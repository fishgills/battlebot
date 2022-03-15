import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constant';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from 'users/users.module';
import { AuthResolver } from './gql/auth.resolvers';
import { AuthController } from './auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { GqlAuthGuard } from './guards/auth.gql.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    LocalStrategy,
    AuthService,
    AuthResolver,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: GqlAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AuthModule {}
