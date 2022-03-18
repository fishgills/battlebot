import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as database from '../typeorm/database.config';

@Module({
  imports: [TerminusModule, TypeOrmModule.forRoot(database.database as any)],
  controllers: [HealthController],
})
export class HealthModule {}
