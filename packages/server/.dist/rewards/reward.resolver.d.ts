import { CreateRewardInput } from './dto/reward.create';
import { RewardModel } from './reward.model';
import { RewardService } from './reward.service';
export declare class RewardResolver {
    private service;
    constructor(service: RewardService);
    rewards(): Promise<RewardModel[]>;
    giveReward(input: CreateRewardInput): Promise<boolean>;
    rewardsGivenToday(user: string): Promise<number>;
    getUserScore(userId: string, isListType: string): Promise<RewardModel[]>;
}
