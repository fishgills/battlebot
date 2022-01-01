import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterModule } from './characters/character.module';
import { CombatModule } from './combat/combat.module';
import { database } from './config/database.config';
import { SlackInstallModule } from './installs/install.module';

@Module({
  imports: [
    CharacterModule,
    CombatModule,
    SlackInstallModule,
    TypeOrmModule.forRoot(database),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
    }),
  ],
})
export class AppModule {}
