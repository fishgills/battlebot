import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Request,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { SlackInstallService } from 'installs/install.service';
import Stripe from 'stripe';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(
    private service: SlackInstallService,
    private stripeService: StripeService,
  ) {}

  @Get('create-portal')
  async createPortal(@Request() req, @Res() res: Response) {
    if (!req.user) {
      return res.redirect(`https://www.${process.env.DOMAIN}/home`);
    }
    const install = await this.service.findOne({
      team_id: req.user.userinfo['https://slack.com/team_id'],
    });
    const session =
      await this.stripeService.stripe.billingPortal.sessions.create({
        return_url: `https://www.${process.env.DOMAIN}/tavern/payments`,
        customer: install.stripeCusId,
      });

    res.redirect(session.url);
  }

  @Get('success')
  async success(
    @Query('sid') sid: string,
    @Request() req,
    @Res() res: Response,
  ) {
    if (!req.user) {
      return res.redirect(`https://backend.${process.env.DOMAIN}/home`);
    }
    // await this.service.updateByTeamId({
    //   team_id: req.user.userinfo['https://slack.com/team_id'],
    //   stripeId: sid,
    // });

    return res.redirect(`https://www.${process.env.DOMAIN}/tavern/`);
  }

  @Get('cancel')
  async cancel(@Request() req, @Res() res: Response) {
    if (!req.user) {
      return res.redirect(`https://backend.${process.env.DOMAIN}/home`);
    }
    await this.service.update(
      {
        team_id: req.user.userinfo['https://slack.com/team_id'],
      },
      {
        stripeSubId: null,
      },
    );
    return res.redirect(`https://backend.${process.env.DOMAIN}/tavern`);
  }

  @Post('webhook')
  async webhook(
    @Res() res: Response,
    @Request() req,
    @Body() stripeDto: Stripe.Event,
  ) {
    const eventType = stripeDto.type;
    switch (eventType) {
      case 'checkout.session.completed':
        {
          const stripeObject: Stripe.Subscription = stripeDto.data
            .object as Stripe.Subscription;
          await this.service.update(
            {
              team_id: stripeObject.metadata.teamId,
              stripeCOSId: stripeObject.id,
            },
            {
              stripeSubId: (stripeObject as any).subscription,
              stripeCusId: stripeObject.customer as string,
            },
          );
          await this.stripeService.updateUsage(stripeObject.metadata.teamId);
        }
        break;
      case 'customer.subscription.deleted':
        {
          const stripeObject = stripeDto.data.object as Stripe.Subscription;
          await this.service.update(
            {
              stripeCusId: stripeObject.customer as string,
              stripeSubId: stripeObject.id,
            },
            {
              stripeCusId: null,
              stripeSubId: null,
            },
          );
        }
        break;
      default:
        Logger.debug(`Unhandled strip event: ${eventType}`);
        break;
    }
    res.send('hi');
  }
}
