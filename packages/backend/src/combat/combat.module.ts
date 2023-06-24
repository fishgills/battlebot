import { Module } from '@nestjs/common';
import { CombatService } from './combat.service';
import { CombatController } from './combat.controller';
import { CombatEntity } from './entities/combat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CombatRepository } from './combat.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CombatEntity])],
  controllers: [CombatController],
  providers: [CombatService, CombatRepository],
  exports: [CombatService, CombatRepository],
})
export class CombatModule {}
