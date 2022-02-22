import { Controller, Get, Query, Request, Res } from '@nestjs/common';
import { Response } from 'express';
import { SlackInstallService } from 'installs/install.service';

@Controller('stripe')
export class StripeController {
  constructor(private service: SlackInstallService) {}
  @Get('success')
  async success(
    @Query('sid') sid: string,
    @Request() req,
    @Res() res: Response,
  ) {
    if (!req.user) {
      return res.redirect(`https://api.${process.env.DOMAIN}/home`);
    }
    await this.service.updateByTeamId({
      team_id: req.user.userinfo['https://slack.com/team_id'],
      stripeId: sid,
    });

    return res.redirect(`https://www.${process.env.DOMAIN}/tavern/`);
  }

  @Get('cancel')
  async cancel(@Request() req, @Res() res: Response) {
    if (!req.user) {
      return res.redirect(`https://api.${process.env.DOMAIN}/home`);
    }
    await this.service.update(
      {
        team_id: req.user.userinfo['https://slack.com/team_id'],
      },
      {
        stripeId: '',
      },
    );
    return res.redirect(`https://api.${process.env.DOMAIN}/tavern`);
  }
}
