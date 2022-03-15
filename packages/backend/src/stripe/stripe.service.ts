import { Injectable } from '@nestjs/common';
import { CharacterService } from 'characters/character.service';
import { SlackInstallService } from 'installs/install.service';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  public static enabled = false;

  constructor(
    private charService: CharacterService,
    private slackService: SlackInstallService,
  ) {}
  public stripe = new Stripe(process.env['STRIPE_KEY'], {
    apiVersion: '2020-08-27',
  });

  public async updateUsage(teamId: string) {
    if (!StripeService.enabled) {
      return;
    }
    if (!teamId) {
      throw new Error('Update Usage failed, no team id?');
    }

    const installInfo = await this.slackService.findOne({
      team_id: teamId,
    });

    const [chars, count] = await this.charService.findAndcount({
      where: {
        teamId,
      },
      select: ['id'],
    });

    const priceInfo = (
      await this.stripe.subscriptionItems.list({
        subscription: installInfo.stripeSubId,
      })
    ).data.find((value) => value.price.id === process.env['STRIPE_PRICE_ID']);

    if (!priceInfo) {
      throw new Error(
        `Could not find matching price info for ${process.env['STRIPE_PRICE_ID']}`,
      );
    }

    const usageRecord = await this.stripe.subscriptionItems.createUsageRecord(
      priceInfo.id,
      {
        quantity: count,
        action: 'set',
      },
    );
    return usageRecord;
  }
}
