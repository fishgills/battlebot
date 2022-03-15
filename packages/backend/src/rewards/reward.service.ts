import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { startOfToday, startOfWeek, subHours } from 'date-fns';

import { MoreThan, Repository } from 'typeorm';
import { AllowedDirections } from './dto/scoreboard';
import { RewardEntity } from './reward.entity';

@Injectable()
export class RewardService {
  constructor(
    @InjectRepository(RewardEntity) public repo: Repository<RewardEntity>,
  ) {}

  find() {
    return this.repo.find();
  }

  async give(to: string, from: string, teamId: string): Promise<boolean> {
    await this.repo.insert({
      from,
      to,
      teamId,
    });
    return true;
  }

  findFromToday(teamId: string, user: string) {
    return this.repo.count({
      where: {
        from: user,
        teamId,
        created_at: MoreThan(subHours(Date.now(), 24).toISOString()),
      },
    });
  }

  getUserScore(teamId: string, userId: string, listtype: string) {
    return this.repo.find({
      where: {
        teamId,
        [listtype]: userId,
      },
    });
  }

  getScoreBoard(teamId: string, direction: AllowedDirections, today?: boolean) {
    const query = this.repo
      .createQueryBuilder()
      .select(`\`${direction}\``, 'userId')
      .addSelect('teamId')
      .addSelect('count(*)', 'count')
      .andWhere('teamId = :id', {
        id: teamId,
      })
      .groupBy(`\`${direction}\``)
      .orderBy('count', 'DESC');
    if (today) {
      const today = startOfToday().toISOString();
      query.andWhere('created_at > :date', {
        date: today,
      });
    }

    return query.getRawMany();
  }
}
