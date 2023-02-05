// auth/auth.controller.ts
import {
  Controller,
  Get,
  Logger,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { Issuer } from 'openid-client';

import { SlackLoginGuard } from './login.guard';

@Controller()
export class SlackAuthController {
  constructor(private readonly logger: Logger) {}
  @UseGuards(SlackLoginGuard)
  @Get('/login')
  login() {
    this.logger.log('slack login');
  }

  @Get('/user')
  user(@Request() req, @Res() res: Response) {
    if (req.user) res.send(req.user.userinfo);
    else res.sendStatus(403);
  }

  @UseGuards(SlackLoginGuard)
  @Get('/callback')
  loginCallback(@Request() req, @Res() res: Response) {
    res.redirect(`https://www.${process.env.DOMAIN}/home`);
    // res.send(req.user);
  }

  @Get('/logout')
  async logout(@Request() req, @Res() res: Response) {
    const id_token = req.user ? req.user.id_token : undefined;
    req.logout();
    req.session.destroy(async () => {
      const TrustIssuer = await Issuer.discover(
        `https://slack.com/.well-known/openid-configuration`,
      );
      const end_session_endpoint = TrustIssuer.metadata.end_session_endpoint;
      if (end_session_endpoint) {
        res.redirect(
          end_session_endpoint +
            '?post_logout_redirect_uri=' +
            process.env
              .OAUTH2_CLIENT_REGISTRATION_LOGIN_POST_LOGOUT_REDIRECT_URI +
            (id_token ? '&id_token_hint=' + id_token : ''),
        );
      } else {
        res.redirect('/');
      }
    });
  }
}
