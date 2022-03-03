import { Inject, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserInputError } from 'apollo-server-core';
import { GqlAuthGuard } from 'auth/guards/auth.gql.guard';

import { StripeService } from 'stripe/stripe.service';

import { CharacterService } from './character.service';
import { CharacterType } from './character.type';
import { CreateCharacterInput } from './dto/create-character.dto';
import { DeleteCharacterInput } from './dto/delete-character.dto';
import { UpdateCharacterInput } from './dto/update-character.dto';

@Resolver(() => CharacterType)
@UseGuards(GqlAuthGuard)
export class CharacterResolver {
  constructor(
    @Inject(CharacterService) private charService: CharacterService,
    @Inject(StripeService) private stripe: StripeService,
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
  async createCharacter(@Args('input') input: CreateCharacterInput) {
    const char = await this.charService.create(input);
    await this.stripe.updateUsage(input.teamId);
    return char;
  }

  @Mutation(() => Int)
  async deleteCharacter(@Args('input') input: DeleteCharacterInput) {
    const result = await this.charService.delete(input);
    if (result.affected && result.affected > 0) {
      await this.stripe.updateUsage(input.teamId);
    }
    return result.affected;
  }
}
