// characters.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { BaseService } from 'src/base/service';
import { RewardEntity } from './entities/reward.entity';
import { startOfToday, subHours } from 'date-fns';
import { AllowedDirections } from './dto/create-scoreboard.dto';

@Injectable()
export class RewardService extends BaseService<RewardEntity> {
  constructor(
    @InjectRepository(RewardEntity)
    protected repo: Repository<RewardEntity>,
  ) {
    super(repo, new Logger('RewardService'));
  }

  findFromToday(teamId: string, user: string) {
    return this.repo.count({
      where: {
        source: user,
        teamId,
        created_at: MoreThan(subHours(Date.now(), 24)),
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
      .createQueryBuilder('scores')
      .select(`${direction}`, 'userId')
      .addSelect('teamId')
      .addSelect('count(*)', 'count')
      .andWhere('teamId = :id', {
        id: teamId,
      })
      .groupBy(`${direction}`)
      .orderBy('count', 'DESC');
    if (today) {
      const today = startOfToday().toISOString();
      query.andWhere('created_at > :date', {
        date: today,
      });
    }
    Logger.debug(query.getQueryAndParameters());
    return query.getRawMany();
  }

  async give(to: string, from: string, teamId: string): Promise<boolean> {
    await this.repo.insert({
      source: from,
      destination: to,
      teamId,
    });
    return true;
  }
}
