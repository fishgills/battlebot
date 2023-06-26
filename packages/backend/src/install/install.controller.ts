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
import { UpdateInstallDto } from './dto/update-install.dto';

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInstallDto: UpdateInstallDto) {
    return this.installService.update(+id, updateInstallDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.installService.remove(id);
  }
}
