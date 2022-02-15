import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JSONScalar } from 'installs/json.scalar';
import { SlackInstallModel } from './install.model';
import { SlackInstallResolver } from './install.resolver';
import { SlackInstallService } from './install.service';

@Module({
  imports: [TypeOrmModule.forFeature([SlackInstallModel])],
  providers: [SlackInstallService, SlackInstallResolver, JSONScalar],
  exports: [SlackInstallService],
})
export class SlackInstallModule {}
