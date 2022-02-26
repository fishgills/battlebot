import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CombatModel } from 'combat/combat.model';
import { StripeModule } from 'stripe/stripe.module';
import { CharacterEntity } from './character.entity';
import { CharacterResolver } from './character.resolver';
import { CharacterService } from './character.service';

@Module({
  imports: [
    forwardRef(() => StripeModule),
    TypeOrmModule.forFeature([CharacterEntity, CombatModel]),
  ],
  providers: [CharacterService, CharacterResolver],
  exports: [CharacterService],
})
export class CharacterModule {}
