import { Inject } from '@nestjs/common';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CharacterModel } from 'src/characters/character.model';
import { CharacterService } from 'src/characters/character.service';
import { CombatModel } from './combat.model';
import { CombatService } from './combat.service';

@Resolver((of) => CombatModel)
export class CombatResolver {
  constructor(
    @Inject(CombatService) private combatService: CombatService,
    @Inject(CharacterService) private charService: CharacterService,
  ) {}

  @Query((returns) => [CombatModel])
  async combats() {
    return this.combatService.findAll();
  }

  @Mutation((returns) => CombatModel)
  async createCombat() {
    return await this.combatService.create();
  }

  @Mutation(() => CombatModel, {
    name: 'addCombatToCharacter',
  })
  addtoCharater(
    @Args('combatId', {
      type: () => String,
      nullable: false,
    })
    combatId: string,
    @Args('characterId', {
      type: () => String,
      nullable: false,
    })
    charId: string,
  ) {
    return this.combatService.addToCharacter(combatId, charId);
  }
}
