import { Controller, Get, Redirect } from '@nestjs/common';
import { Public } from 'auth/make-public';

@Controller('install')
export class SlackInstallController {
  @Get()
  @Public()
  @Redirect('https://slack.com/oauth/v2/authorize', 302)
  public index() {
    // nothing, just redirect
  }
}
