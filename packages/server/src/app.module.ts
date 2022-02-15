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
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from 'apollo-server-core';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
@Module({
  imports: [
    CharacterModule,
    CombatModule,
    SlackInstallModule,
    RewardModule,
    HttpModule,
    TypeOrmModule.forRoot(database.database),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      debug: true,
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: 'schema.gql',
      plugins: [
        process.env['NODE_ENV'] === 'production'
          ? ApolloServerPluginLandingPageProductionDefault()
          : ApolloServerPluginLandingPageLocalDefault({
              footer: false,
            }),
      ],
    }),
    AuthModule,
  ],
  controllers: [],
})
export class AppModule {}
