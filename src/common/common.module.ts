import { Module } from '@nestjs/common';
import { BattleLogScalar } from './custom-log.scalar';

@Module({
  providers: [BattleLogScalar],
})
export class CommonModule {}
