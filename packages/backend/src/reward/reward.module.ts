import { Module } from '@nestjs/common';
import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewardEntity } from './entities/reward.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RewardEntity])],
  controllers: [RewardController],
  providers: [RewardService],
})
export class RewardModule {}
