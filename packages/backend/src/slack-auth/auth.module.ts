// src/auth/auth.module.ts
import { Logger, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SlackAuthController } from './auth.controller';
import { buildOpenIdClient, OidcStrategy } from './oidc.strategy';
import { SessionSerializer } from './session.serializer';

const OidcStrategyFactory = {
  provide: 'OidcStrategy',
  useFactory: async () => {
    const client = await buildOpenIdClient(); // secret sauce! build the dynamic client before injecting it into the strategy for use in the constructor super call.
    const strategy = new OidcStrategy(client);
    return strategy;
  },
};

@Module({
  imports: [
    PassportModule.register({ session: true, defaultStrategy: 'oidc' }),
  ],
  controllers: [SlackAuthController],
  providers: [OidcStrategyFactory, SessionSerializer, Logger],
})
export class SlackAuthModule {}
