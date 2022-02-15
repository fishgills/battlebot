import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterEntity } from 'characters/character.entity';
import { CharacterModule } from '../characters/character.module';
import { CombatModel } from './combat.model';
import { CombatResolver } from './combat.resolver';
import { CombatService } from './combat.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CombatModel, CharacterEntity]),
    forwardRef(() => CharacterModule),
  ],
  providers: [CombatService, CombatResolver],
  exports: [CombatService],
})
export class CombatModule {}
