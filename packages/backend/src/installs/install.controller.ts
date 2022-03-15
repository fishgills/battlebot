import { Controller, Get, Redirect } from '@nestjs/common';
import { Public } from 'auth/make-public';

@Controller('install')
export class SlackInstallController {
  @Get()
  @Public()
  @Redirect(
    `https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=channels:history,commands,users:read&user_scope=`,
    302,
  )
  public index() {
    // nothing, just redirect
  }
}
