import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InstallService } from './install.service';
import { CreateInstallDto } from './dto/create-install.dto';
import { FindOptionsWhere } from 'typeorm';
import { InstallEntity } from './entities/install.entity';
// import { UpdateInstallDto } from './dto/update-install.dto';

@Controller('install')
export class InstallController {
  constructor(private readonly installService: InstallService) {}

  @Post()
  async create(@Body() createInstallDto: CreateInstallDto) {
    await this.installService.create(createInstallDto);
    return this.installService.findByTeamId(createInstallDto.team_id);
  }

  @Get()
  findAll() {
    return this.installService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.installService.findByTeamId(id);
  }
  /**
   *
   * @param id Team Id
   * @returns
   */
  @Delete(':id')
  removeBy(@Param('id') id: string) {
    return this.installService.removeByTeamId(id);
  }
}
