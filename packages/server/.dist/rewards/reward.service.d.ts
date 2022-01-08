import { Repository } from 'typeorm';
import { RewardModel } from './reward.model';
export declare class RewardService {
    repo: Repository<RewardModel>;
    constructor(repo: Repository<RewardModel>);
    find(): Promise<RewardModel[]>;
    give(to: string, from: string): Promise<boolean>;
    findFromToday(user: string): Promise<number>;
    getUserScore(userId: string, listtype: string): Promise<RewardModel[]>;
    getScoreBoard(direction?: 'from' | 'to', today?: boolean): Promise<RewardModel[]>;
}
