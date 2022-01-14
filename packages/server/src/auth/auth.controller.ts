// auth/auth.controller.ts
import { Controller, Get, Request, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { LoginGuard } from './login.guard';
import { Issuer } from 'openid-client';

@Controller()
export class AuthController {
  @UseGuards(LoginGuard)
  @Get('/login')
  login() {
    console.log('slack login');
  }

  @Get('/user')
  user(@Request() req, @Res() res: Response) {
    if (!req.user) {
      res.sendStatus(403);
    } else {
      res.send(req.user);
    }
  }

  @UseGuards(LoginGuard)
  @Get('/callback')
  loginCallback(@Request() req, @Res() res: Response) {
    res.send(req.user);
  }

  @Get('/logout')
  async logout(@Request() req, @Res() res: Response) {
    const id_token = req.user ? req.user.id_token : undefined;
    req.logout();
    req.session.destroy(async (error: any) => {
      const TrustIssuer = await Issuer.discover(
        `https://slack.com/.well-known/openid-configuration`,
      );
      res.send({
        status: 'ok',
      });
    });
  }
}
