import { Inject } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CombatModel } from 'src/combat/combat.model';

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

  @Query((returns) => CharacterModel)
  findByOwner(
    @Args('owner', {
      type: () => String,
      nullable: false,
    })
    owner: string,
  ) {
    return this.charService.findByOwner(owner);
  }

  @Mutation((returns) => CharacterModel)
  async reroll(
    @Args('id', {
      type: () => String,
      nullable: false,
    })
    id: string,
  ) {
    const char = await this.charService.findOne({
      where: {
        id,
      },
    });
    if (char.rolls >= 5) {
      throw new Error('Character ran out of rolls');
    }
    this.charService.rollCharacter(char);
    await this.charService.update(id, char);
    return char;
  }

  @Mutation((returns) => CharacterModel)
  createCharacter(@Args('input') input: CreateCharacterInput) {
    return this.charService.create(input);
  }

  // @ResolveField(() => [CombatModel])
  // async attacking(@Parent() char: CharacterModel) {
  //   return await char.attacking;
  // }
  // @ResolveField(() => [CombatModel])
  // async combats(@Parent() char: CharacterModel) {
  //   return await char.combats;
  // }
}
