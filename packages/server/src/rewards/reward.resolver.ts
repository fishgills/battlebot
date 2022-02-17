import { Inject } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CreateRewardInput } from './dto/reward.create';

import { RewardModel } from './reward.model';
import { RewardService } from './reward.service';

@Resolver(() => RewardModel)
export class RewardResolver {
  constructor(@Inject(RewardService) private service: RewardService) {}

  @Query(() => [RewardModel])
  rewards() {
    return this.service.find();
  }

  @Mutation(() => Boolean)
  giveReward(@Args('input') input: CreateRewardInput) {
    return this.service.give(input.to, input.from);
  }

  @Query(() => Int)
  rewardsGivenToday(@Args('user') user: string): Promise<number> {
    return this.service.findFromToday(user);
  }

  @Query(() => [RewardModel])
  getUserScore(
    @Args('userId') userId: string,
    @Args('listType', {
      defaultValue: 'from',
    })
    isListType: string,
  ) {
    return this.service.getUserScore(userId, isListType);
  }
}
