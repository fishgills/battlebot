import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CombatModel } from 'combat/combat.model';
import { CharacterEntity } from './character.entity';
import { CharacterResolver } from './character.resolver';
import { CharacterService } from './character.service';

@Module({
  imports: [TypeOrmModule.forFeature([CharacterEntity, CombatModel])],
  providers: [CharacterService, CharacterResolver],
  exports: [CharacterService],
})
export class CharacterModule {}
