import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewardEntity } from './reward.entity';
import { RewardResolver } from './reward.resolver';
import { RewardService } from './reward.service';

@Module({
  imports: [TypeOrmModule.forFeature([RewardEntity])],
  providers: [RewardService, RewardResolver],
  exports: [RewardService],
})
export class RewardModule {}
