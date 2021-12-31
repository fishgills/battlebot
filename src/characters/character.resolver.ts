import { Inject } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CharacterModel } from './character.model';
import { CharacterService } from './character.service';

@Resolver((of) => CharacterModel)
export class CharacterResolver {
  constructor(
    @Inject(CharacterService) private charService: CharacterService,
  ) {}

  @Query((returns) => [CharacterModel])
  characters() {
    return this.charService.findAll();
  }

  @Mutation((returns) => CharacterModel)
  createCharacter(@Args('name') name: string) {
    return this.charService.create({
      name,
    });
  }

  @Mutation(() => CharacterModel, { name: 'addCharacterToCombat' })
  addToCombat(
    @Args('characterId', { type: () => String, nullable: false })
    characterId: string,
    @Args('combatId', { type: () => String, nullable: false }) combatId: string,
  ) {
    return this.charService.addToCombat(characterId, combatId);
  }
}
