import { Module } from '@nestjs/common';
import { StripeResolver } from './stripe.resolver';
import { StripeController } from './stripe.controller';
import { SlackInstallModule } from 'installs/install.module';
import { StripeService } from './stripe.service';

@Module({
  imports: [SlackInstallModule],
  providers: [StripeResolver, StripeService],
  controllers: [StripeController],
  exports: [StripeService],
})
export class StripeModule {}
