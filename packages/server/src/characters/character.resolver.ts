import { Inject } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserInputError } from 'apollo-server-core';

import { CharacterService } from './character.service';
import { CharacterType } from './character.type';
import { CreateCharacterInput } from './dto/create-character.dto';
import { UpdateCharacterInput } from './dto/update-character.dto';

@Resolver(() => CharacterType)
export class CharacterResolver {
  constructor(
    @Inject(CharacterService) private charService: CharacterService,
  ) {}

  @Query(() => [CharacterType])
  characters() {
    return this.charService.findAll();
  }

  @Query(() => CharacterType)
  findByOwner(
    @Args('owner', {
      type: () => String,
      nullable: false,
    })
    owner: string,
    @Args('teamId', {
      type: () => String,
      nullable: true,
    })
    teamId?: string | undefined,
  ) {
    return this.charService.findByOwner(owner, teamId);
  }

  @Mutation(() => Int)
  async CharacterUpdate(
    @Args('id') id: string,
    @Args('input') input: UpdateCharacterInput,
  ) {
    const result = await this.charService.update(id, input);
    return result.affected;
  }

  @Mutation(() => CharacterType)
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
      throw new UserInputError('Character ran out of rolls');
    }
    this.charService.rollCharacter(char);
    await this.charService.update(id, char);
    return char;
  }

  @Mutation(() => CharacterType)
  createCharacter(@Args('input') input: CreateCharacterInput) {
    return this.charService.create(input);
  }
}
