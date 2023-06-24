import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CombatService } from './combat.service';
import { CreateCombatDto } from './dto/create-combat.dto';
import { UpdateCombatDto } from './dto/update-combat.dto';

@Controller('combat')
export class CombatController {
  constructor(private readonly combatService: CombatService) {}

  @Post()
  create(@Body() createCombatDto: CreateCombatDto) {
    return this.combatService.create(createCombatDto);
  }

  @Get()
  findAll() {
    return this.combatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.combatService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCombatDto: UpdateCombatDto) {
    return this.combatService.update(id, updateCombatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.combatService.remove(id);
  }
}
