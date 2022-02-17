import { Inject } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateSlackInstallInput } from './create-install.dto';
import { SlackInstallModel } from './install.model';
import { SlackInstallService } from './install.service';
import { UpdateSlackInstallInput } from './update-install.dto';

@Resolver(() => SlackInstallModel)
export class SlackInstallResolver {
  constructor(
    @Inject(SlackInstallService) readonly service: SlackInstallService,
  ) {}

  @Query(() => [SlackInstallModel])
  installs() {
    return this.service.findAll();
  }

  @Query(() => SlackInstallModel)
  install(@Args('team_id', { type: () => String }) team_id: string) {
    return this.service.findOne(team_id);
  }

  @Mutation(() => SlackInstallModel)
  async createInstall(
    @Args('input')
    input: CreateSlackInstallInput,
  ) {
    await this.service.createInstall(input);
    return this.service.findOne(input.team_id);
  }

  @Mutation(() => SlackInstallModel)
  updateInstall(@Args('input') input: UpdateSlackInstallInput) {
    return this.service.update(input);
  }

  @Mutation(() => String)
  removeInstall(
    @Args('team_id', { type: () => String, nullable: false }) team_id: string,
  ) {
    return this.service.deleteInstall(team_id);
  }
}
