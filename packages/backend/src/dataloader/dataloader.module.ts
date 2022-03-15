import { Module } from '@nestjs/common';
import { CharacterModule } from 'characters/character.module';
import { CombatModule } from 'combat/combat.module';
import { DataloaderService } from './dataloader.service';

@Module({
  providers: [DataloaderService],
  imports: [CharacterModule, CombatModule],
  exports: [DataloaderService],
})
export class DataloaderModule {}
