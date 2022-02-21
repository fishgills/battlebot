import { Args, Mutation, Resolver } from '@nestjs/graphql';
import Stripe from 'stripe';
import { StripeSession } from './stripe.type';
@Resolver()
export class StripeResolver {
  private stripe: Stripe;
  constructor() {
    this.stripe = new Stripe(process.env['STRIPE_KEY'], {
      apiVersion: '2020-08-27',
    });
  }
  @Mutation((returns) => StripeSession)
  async CreateStripeCheckoutSession(@Args('priceId') priceId: string) {
    const session: Stripe.Checkout.Session =
      await this.stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
          },
        ],
        success_url: `https://www.${process.env.DOMAIN}/stripe/success?sid={CHECKOUT_SESSION_ID}`,
        cancel_url: `https://www.${process.env.DOMAIN}/stripe/cancel`,
      });
    return session;
  }
}
