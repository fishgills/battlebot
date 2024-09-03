import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { CharacterService } from './character.service';
import { UserService } from '../user/user.service';
import { CreateCharacterDto } from './DTO/create-character.dto';
import { CombatDTO } from './DTO/combat.dto';

@Controller('character')
export class CharacterController {
  constructor(
    private readonly characterService: CharacterService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async createCharacter(@Body() body: CreateCharacterDto) {
    const user = await this.userService.findUserById(body.userId);
    return this.characterService.createCharacter(user, body.name);
  }

  @Get()
  async getCharacters() {
    return this.characterService.findAllCharacters();
  }

  @Get(':id')
  async getCharacter(@Param('id') id: number) {
    return this.characterService.findCharacterById(id);
  }

  @Post('combat')
  async combat(@Body() body: CombatDTO) {
    return this.characterService.combat(body.attackerId, body.defenderId);
  }

  @Delete(':id')
  async deleteCharacter(@Param('id') id: number) {
    return this.characterService.deleteCharacter(id);
  }
}
