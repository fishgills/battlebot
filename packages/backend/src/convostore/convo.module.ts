import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConvoEntity } from './convo.entity';
import { ConvoResolver } from './convo.resolver';
import { ConvoService } from './convo.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConvoEntity])],
  providers: [ConvoService, ConvoResolver],
  exports: [ConvoService],
})
export class ConvoModule {}
