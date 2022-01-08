import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterModel } from 'src/characters/character.model';
import { CharacterModule } from 'src/characters/character.module';
import { CombatModel } from './combat.model';
import { CombatResolver } from './combat.resolver';
import { CombatService } from './combat.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CombatModel, CharacterModel]),
    forwardRef(() => CharacterModule),
  ],
  providers: [CombatService, CombatResolver],
  exports: [CombatService],
})
export class CombatModule {}
