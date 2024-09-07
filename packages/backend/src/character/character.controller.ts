import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CharacterService } from './character.service';
import { UserService } from '../user/user.service';
import { CreateCharacterDto } from './DTO/create-character.dto';
import { CombatDTO } from './DTO/combat.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('character')
export class CharacterController {
  constructor(
    private readonly characterService: CharacterService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCharacter(@Body() body: CreateCharacterDto) {
    const user = await this.userService.findUserById(body.userId);
    return this.characterService.createCharacter(user, body.name);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCharacters() {
    return this.characterService.findAllCharacters();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getCharacter(@Param('id') id: number) {
    return this.characterService.findCharacterById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('combat')
  async combat(@Body() body: CombatDTO) {
    return this.characterService.combat(body.attackerId, body.defenderId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteCharacter(@Param('id') id: number) {
    return this.characterService.deleteCharacter(id);
  }
}
