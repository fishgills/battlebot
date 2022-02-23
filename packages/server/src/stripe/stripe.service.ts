import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  public stripe = new Stripe(process.env['STRIPE_KEY'], {
    apiVersion: '2020-08-27',
  });
}
