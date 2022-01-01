import { Inject } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CreateSlackInstallInput } from './create-install.dto';
import { SlackInstallModel } from './install.model';
import { SlackInstallService } from './install.service';

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
  createInstall(
    @Args('input')
    input: CreateSlackInstallInput,
  ) {
    return this.service.createInstall(input);
  }

  @Mutation((returns) => String)
  removeInstall(
    @Args('team_id', { type: () => String, nullable: false }) team_id: string,
  ) {
    return this.service.deleteInstall(team_id);
  }
}
