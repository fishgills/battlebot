import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { DeleteCharacterInput } from './dto/delete-character.dt';
import { ApiResponse } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post()
  create(@Body() createCharacterDto: CreateCharacterDto) {
    return this.charactersService.create(createCharacterDto);
  }

  @Get()
  findAll() {
    return this.charactersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.charactersService.findOne({
      where: {
        id,
      },
    });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCharacterDto: UpdateCharacterDto,
  ) {
    return this.charactersService.update(id, updateCharacterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.charactersService.delete(id);
  }

  @Delete()
  @ApiResponse({
    type: DeleteResult,
  })
  removeFromTeam(@Body() input: DeleteCharacterInput) {
    return this.charactersService.removeFromTeam(input);
  }

  @Get('owner/:team/:id')
  async findByOwner(@Param('id') owner: string, @Param('team') team: string) {
    try {
      return await this.charactersService.findByOwner(owner, team);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No character found.',
        },
        HttpStatus.NOT_FOUND,
        {
          cause: error,
        },
      );
    }
  }

  @Post(':id/reroll')
  async reroll(
    @Param('id')
    id: string,
  ) {
    let char = await this.charactersService.findOne({
      where: {
        id,
      },
    });
    if (char.rolls >= 5) {
      throw new Error('Character ran out of rolls');
    }
    char = this.charactersService.rollCharacter(char);
    await this.charactersService.update(id, char);
    return char;
  }
}
