import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewardModel } from './reward.model';
import { RewardResolver } from './reward.resolver';
import { RewardService } from './reward.service';

@Module({
  imports: [TypeOrmModule.forFeature([RewardModel])],
  providers: [RewardService, RewardResolver],
  exports: [RewardService],
})
export class RewardModule {}
