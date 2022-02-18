import { Inject } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CreateRewardInput } from './dto/reward.create';

import { RewardType } from './types/reward.type';
import { RewardService } from './reward.service';
import { RewardScore } from './types/reward.scoreboard.type';
import { RewardsScoreBoardInput } from './dto/scoreboard';

@Resolver(() => RewardType)
export class RewardResolver {
  constructor(@Inject(RewardService) private service: RewardService) {}

  @Query(() => [RewardType])
  rewards() {
    return this.service.find();
  }

  @Mutation(() => Boolean)
  giveReward(@Args('input') input: CreateRewardInput) {
    return this.service.give(input.to, input.from, input.teamId);
  }

  @Query(() => Int)
  rewardsGivenToday(
    @Args('user') user: string,
    @Args('teamId') teamId: string,
  ): Promise<number> {
    return this.service.findFromToday(teamId, user);
  }

  @Query(() => [RewardType])
  getUserScore(
    @Args('teamId') teamId: string,
    @Args('userId') userId: string,
    @Args('listType', {
      defaultValue: 'from',
    })
    isListType: string,
  ) {
    return this.service.getUserScore(teamId, userId, isListType);
  }

  @Query(() => [RewardScore])
  async ScoreBoard(@Args('input') input: RewardsScoreBoardInput) {
    const result = await this.service.getScoreBoard(
      input.teamId,
      input.direction,
      input.today,
    );
    return result as RewardScore[];
  }
}
