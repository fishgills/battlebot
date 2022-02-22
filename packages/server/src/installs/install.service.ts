import { ResultGroup } from '@dice-roller/rpg-dice-roller/types/results';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, Repository } from 'typeorm';
import { CreateSlackInstallInput } from './create-install.dto';
import { SlackInstallModel } from './install.model';
import { UpdateSlackInstallInput } from './update-install.dto';

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

  async updateByTeamId(input: Partial<UpdateSlackInstallInput>) {
    return await this.slackRepo.update({ team_id: input.team_id }, input);
  }

  async update(
    conditions: FindConditions<SlackInstallModel>,
    entity: Partial<SlackInstallModel>,
  ): Promise<SlackInstallModel> {
    await this.slackRepo.update(conditions, entity);
    return this.slackRepo.findOne(entity.id);
  }

  public async deleteInstall(conditions: FindConditions<SlackInstallModel>) {
    const reuslt = await this.slackRepo.delete(conditions);
    if (reuslt.affected > 0) {
      return reuslt.affected;
    } else {
      return null;
    }
  }
}
