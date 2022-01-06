import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { time } from 'console';
import { formatISO9075, startOfToday, subHours, subSeconds } from 'date-fns';
import { isListType } from 'graphql';

import { Between, LessThan, MoreThan, Repository } from 'typeorm';
import { RewardModel } from './reward.model';

@Injectable()
export class RewardService {
  constructor(
    @InjectRepository(RewardModel) public repo: Repository<RewardModel>,
  ) {}

  find() {
    return this.repo.find();
  }

  async give(to: string, from: string): Promise<boolean> {
    await this.repo.insert({
      from,
      to,
    });
    return true;
  }

  findFromToday(user: string) {
    return this.repo.count({
      where: {
        from: user,
        created_at: MoreThan(subHours(Date.now(), 24).toISOString()),
      },
    });
  }

  getUserScore(userId: string, listtype: string) {
    return this.repo.find({
      where: {
        [listtype]: userId,
      },
    });
  }

  getScoreBoard(direction: 'from' | 'to' = 'from', today?: boolean) {
    const query = this.repo
      .createQueryBuilder()
      .groupBy(`\`${direction}\``)
      .limit(100);
    if (today) {
      const today = startOfToday().toISOString();
      query.where('created_at > :date', {
        date: today,
      });
    }

    return query.getMany();
  }
}
