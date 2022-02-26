import { Module } from '@nestjs/common';
import { StripeResolver } from './stripe.resolver';
import { StripeController } from './stripe.controller';
import { SlackInstallModule } from 'installs/install.module';
import { StripeService } from './stripe.service';
import { CharacterModule } from 'characters/character.module';

@Module({
  imports: [SlackInstallModule, CharacterModule],
  providers: [StripeResolver, StripeService],
  controllers: [StripeController],
  exports: [StripeService],
})
export class StripeModule {}
