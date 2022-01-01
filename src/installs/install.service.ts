import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Unique } from 'typeorm';
import { CreateSlackInstallInput } from './create-install.dto';
import { SlackInstallModel } from './install.model';

@Injectable()
export class SlackInstallService {
  constructor(
    @InjectRepository(SlackInstallModel)
    readonly slackRepo: Repository<SlackInstallModel>,
  ) {}

  public findAll() {
    return this.slackRepo.find();
  }

  public findOne(team_id: string) {
    return this.slackRepo.findOneOrFail({
      where: {
        team_id,
      },
    });
  }

  public createInstall(input: CreateSlackInstallInput) {
    return this.slackRepo.upsert(input, ['team_id']);
  }

  public async deleteInstall(team_id: string) {
    let found = await this.slackRepo.findOne({
      where: {
        team_id,
      },
    });
    if (found) {
      await this.slackRepo.remove(found);
      return team_id;
    } else {
      return null;
    }
  }
}
