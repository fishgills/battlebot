import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterModule } from './characters/character.module';
import { CombatModule } from './combat/combat.module';
import * as database from './config/database.config';
import { RewardModule } from './rewards/reward.module';
import { SlackInstallModule } from './installs/install.module';
import { AuthModule } from './auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import {
  ApolloServerPluginInlineTrace,
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from 'apollo-server-core';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DataloaderModule } from 'dataloader/dataloader.module';
import { DataloaderService } from 'dataloader/dataloader.service';
import { ConvoModule } from 'convostore/convo.module';
@Module({
  imports: [
    CharacterModule,
    CombatModule,
    SlackInstallModule,
    RewardModule,
    HttpModule,
    ConvoModule,
    TypeOrmModule.forRoot(database.database),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [DataloaderModule],
      inject: [DataloaderService],
      driver: ApolloDriver,
      useFactory: (dlService: DataloaderService) => {
        return {
          playground: false,
          plugins: [
            ApolloServerPluginInlineTrace(),
            process.env['NODE_ENV'] === 'production'
              ? ApolloServerPluginLandingPageProductionDefault()
              : ApolloServerPluginLandingPageLocalDefault({
                  footer: false,
                }),
          ],
          autoSchemaFile: true,
          context: () => ({
            loaders: dlService.createLoaders(),
          }),
        };
      },
    }),
    AuthModule,
  ],
  controllers: [],
})
export class AppModule {}
