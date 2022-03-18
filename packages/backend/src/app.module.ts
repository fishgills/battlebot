import { forwardRef, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterModule } from './characters/character.module';
import { CombatModule } from './combat/combat.module';
import { RewardModule } from './rewards/reward.module';
import { SlackInstallModule } from './installs/install.module';
import { SlackAuthModule } from './slack-auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import {
  ApolloServerPluginInlineTrace,
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from 'apollo-server-core';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DataloaderModule } from 'dataloader/dataloader.module';
import { DataloaderService } from 'dataloader/dataloader.service';
import { ConvoModule } from 'convostore/convo.module';
import { StripeModule } from './stripe/stripe.module';
import { AuthModule } from 'auth/auth.module';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfigAsync } from 'typeorm/typeorm.config.';
@Module({
  imports: [
    forwardRef(() => StripeModule),
    forwardRef(() => CharacterModule),
    CombatModule,
    SlackInstallModule,
    RewardModule,
    HttpModule,
    ConvoModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [DataloaderModule],
      inject: [DataloaderService],
      driver: ApolloDriver,
      useFactory: (dlService: DataloaderService) => {
        return {
          playground: false,
          plugins: [
            ApolloServerPluginInlineTrace(),
            ApolloServerPluginLandingPageLocalDefault(),
            // process.env['NODE_ENV'] === 'production'
            //   ? ApolloServerPluginLandingPageProductionDefault()
            //   : ApolloServerPluginLandingPageLocalDefault({
            //       footer: false,
            //     }),
          ],
          autoSchemaFile: true,
          context: (obj) => {
            return {
              req: obj.req,
              loaders: dlService.createLoaders(),
            };
          },
          // context: (obj) => ({
          //   loaders: dlService.createLoaders(),
          // }),
        };
      },
    }),
    AuthModule,
    SlackAuthModule,
    UsersModule,
    HealthModule,
  ],
  providers: [],
  // providers: [
  //   {
  //     provide: APP_GUARD,
  //     useClass: JwtAuthGuard,
  //   },
  // ],
  controllers: [],
})
export class AppModule {}
