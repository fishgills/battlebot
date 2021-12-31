import { Inject } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CharacterModel } from './character.model';
import { CharacterService } from './character.service';
import { CreateCharacterInput } from './create-character.dto';

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
  createCharacter(@Args('input') input: CreateCharacterInput) {
    return this.charService.create(input);
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
