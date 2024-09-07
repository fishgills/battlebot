import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { CharacterService } from './character.service';
import { UserService } from '../user/user.service';
import { CreateCharacterDto } from './DTO/create-character.dto';
import { CombatDTO } from './DTO/combat.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('character')
export class CharacterController {
  private readonly logger = new Logger(CharacterController.name);
  constructor(
    private readonly characterService: CharacterService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCharacter(@Body() body: CreateCharacterDto) {
    this.logger.log(`Creating character for user ${body.userId}`);
    const user = await this.userService.findUserById(body.userId);
    return this.characterService.createCharacter(user, body.name);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCharacters() {
    this.logger.log('Getting all characters');
    return this.characterService.findAllCharacters();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getCharacter(@Param('id') id: number) {
    this.logger.log(`Getting character ${id}`);
    return this.characterService.findCharacterById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('combat')
  async combat(@Body() body: CombatDTO) {
    this.logger.log(`Combat between ${body.attackerId} and ${body.defenderId}`);
    return this.characterService.combat(body.attackerId, body.defenderId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteCharacter(@Param('id') id: number) {
    this.logger.log(`Deleting character ${id}`);
    return this.characterService.deleteCharacter(id);
  }
}
