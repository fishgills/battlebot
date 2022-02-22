import { Module } from '@nestjs/common';
import { StripeResolver } from './stripe.resolver';
import { StripeController } from './stripe.controller';
import { SlackInstallModule } from 'installs/install.module';

@Module({
  imports: [SlackInstallModule],
  providers: [StripeResolver],
  controllers: [StripeController],
})
export class StripeModule {}
