import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RewardService } from './reward.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { ApiResponse } from '@nestjs/swagger';
import { RewardEntity } from './entities/reward.entity';
import { RewardsScoreBoardInput } from './dto/create-scoreboard.dto';
import { RewardScore } from './entities/scoreboard.entity';

@Controller('reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Post()
  create(@Body() createRewardDto: CreateRewardDto) {
    return this.rewardService.create(createRewardDto);
  }

  @ApiResponse({
    type: Array<RewardEntity>,
  })
  @Get()
  findAll() {
    return this.rewardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rewardService.findOne({
      where: {
        id: id,
      },
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRewardDto: UpdateRewardDto,
  ) {
    return this.rewardService.update(id, updateRewardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rewardService.delete(id);
  }
  @Get('rewards-today')
  @ApiResponse({
    type: Number,
  })
  rewardsGivenToday(
    @Param('user') user: string,
    @Param('teamId') teamId: string,
  ): Promise<number> {
    return this.rewardService.findFromToday(teamId, user);
  }

  @Post('give')
  giveReward(@Param('input') input: CreateRewardDto) {
    return this.rewardService.give(
      input.destination,
      input.source,
      input.teamId,
    );
  }

  @Post('score')
  async ScoreBoard(@Body() input: RewardsScoreBoardInput) {
    const result = await this.rewardService.getScoreBoard(
      input.teamId,
      input.direction,
      input.today,
    );
    return result as RewardScore[];
  }
}
