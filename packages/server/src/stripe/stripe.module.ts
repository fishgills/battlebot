import { Module } from '@nestjs/common';
import { StripeResolver } from './stripe.resolver';
import { StripeController } from './stripe.controller';

@Module({
  providers: [StripeResolver],
  controllers: [StripeController],
})
export class StripeModule {}
