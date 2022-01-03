import { Inject } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CreateSlackInstallInput } from './create-install.dto';
import { SlackInstallModel } from './install.model';
import { SlackInstallService } from './install.service';
import { UpdateSlackInstallInput } from './update-install.dto';

@Resolver((of) => SlackInstallModel)
export class SlackInstallResolver {
  constructor(
    @Inject(SlackInstallService) readonly service: SlackInstallService,
  ) {}

  @Query((returns) => [SlackInstallModel])
  installs() {
    return this.service.findAll();
  }

  @Query((returns) => SlackInstallModel)
  install(@Args('team_id', { type: () => String }) team_id: string) {
    return this.service.findOne(team_id);
  }

  @Mutation((returns) => SlackInstallModel)
  async createInstall(
    @Args('input')
    input: CreateSlackInstallInput,
  ) {
    await this.service.createInstall(input);
    return this.service.findOne(input.team_id);
  }

  @Mutation((returns) => SlackInstallModel)
  updateInstall(@Args('input') input: UpdateSlackInstallInput) {
    return this.service.update(input);
  }

  @Mutation((returns) => String)
  removeInstall(
    @Args('team_id', { type: () => String, nullable: false }) team_id: string,
  ) {
    return this.service.deleteInstall(team_id);
  }
}
