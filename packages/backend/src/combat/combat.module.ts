import { Module, forwardRef, Logger } from '@nestjs/common';
import { CombatService } from './combat.service';
import { CombatController } from './combat.controller';
import { CombatEntity } from './entities/combat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CombatRepository } from './combat.repository';
import { CharactersModule } from 'src/characters/characters.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CombatEntity]),
    forwardRef(() => CharactersModule),
  ],
  controllers: [CombatController],
  providers: [CombatService, CombatRepository, Logger],
  exports: [CombatService, CombatRepository],
})
export class CombatModule {}
