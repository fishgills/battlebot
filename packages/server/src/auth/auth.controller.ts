import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UserType } from 'users/users.type';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './make-public';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request) {
    return this.authService.login(req.user as UserType);
  }
}
