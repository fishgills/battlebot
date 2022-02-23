import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SlackInstallService } from 'installs/install.service';
import Stripe from 'stripe';
import { StripeService } from './stripe.service';
import { StripeSession } from './stripe.type';
@Resolver()
export class StripeResolver {
  constructor(
    private service: SlackInstallService,
    private stripeService: StripeService,
  ) {}
  @Mutation((returns) => StripeSession)
  async CreateStripeCheckoutSession(
    @Args('priceId') priceId: string,
    @Args('teamId') teamId: string,
  ) {
    const session: Stripe.Checkout.Session =
      await this.stripeService.stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        metadata: {
          teamId,
        },
        line_items: [
          {
            price: priceId,
          },
        ],
        success_url: `https://www.${process.env.DOMAIN}/tavern/payments`,
        cancel_url: `https://www.${process.env.DOMAIN}/tavern/cancel`,
      });
    await this.service.update(
      { team_id: teamId },
      {
        stripeCOSId: session.id,
      },
    );
    return session;
  }
}
