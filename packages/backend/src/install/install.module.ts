import { Module } from '@nestjs/common';
import { InstallService } from './install.service';
import { InstallController } from './install.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstallEntity } from './entities/install.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InstallEntity])],
  controllers: [InstallController],
  providers: [InstallService],
})
export class InstallModule {}
