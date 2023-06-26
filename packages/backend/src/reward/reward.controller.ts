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
    return this.rewardService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRewardDto: UpdateRewardDto) {
    return this.rewardService.update(+id, updateRewardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rewardService.remove(id);
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
}
