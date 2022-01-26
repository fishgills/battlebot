import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CombatModel } from 'combat/combat.model';
import { CharacterModel } from './character.model';
import { CharacterResolver } from './character.resolver';
import { CharacterService } from './character.service';

@Module({
  imports: [TypeOrmModule.forFeature([CharacterModel, CombatModel])],
  providers: [CharacterService, CharacterResolver],
  exports: [CharacterService],
})
export class CharacterModule {}
