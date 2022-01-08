import { Inject } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { isListType } from 'graphql';
import { CreateRewardInput } from './dto/reward.create';
import { RewardsScoreBoardInput } from './dto/scoreboard';

import { RewardModel } from './reward.model';
import { RewardService } from './reward.service';

@Resolver((of) => RewardModel)
export class RewardResolver {
  constructor(@Inject(RewardService) private service: RewardService) {}

  @Query((returns) => [RewardModel])
  rewards() {
    return this.service.find();
  }

  @Mutation(() => Boolean)
  giveReward(@Args('input') input: CreateRewardInput) {
    return this.service.give(input.to, input.from);
  }

  @Query((returns) => Int)
  rewardsGivenToday(@Args('user') user: string): Promise<number> {
    return this.service.findFromToday(user);
  }

  @Query((returns) => [RewardModel])
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
