import { Field, ObjectType } from '@nestjs/graphql';
import Stripe from 'stripe';
@ObjectType()
export class StripeSession implements Partial<Stripe.Checkout.Session> {
  @Field()
  id: string;
}
