import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterModule } from './characters/character.module';
import { CombatModule } from './combat/combat.module';
import { database } from './config/database.config';
import { RewardModule } from './rewards/reward.module';
import { SlackInstallModule } from './installs/install.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ConnectproxyController } from './connectproxy/connectproxy.controller';
@Module({
  imports: [
    ConfigModule.forRoot(),
    CharacterModule,
    CombatModule,
    SlackInstallModule,
    RewardModule,
    TypeOrmModule.forRoot(database),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
    }),
    AuthModule,
  ],
  controllers: [ConnectproxyController],
})
export class AppModule {}
