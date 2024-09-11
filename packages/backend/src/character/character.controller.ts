import { UseGuards, Logger } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CreateCharacterDto } from './DTO/create-character.dto';
import { CombatInput } from './DTO/combat.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Character } from './character.entity';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CombatEnd } from './combat-type.dto';
import GraphQLJSON from 'graphql-type-json';

@Resolver((of) => Character)
export class CharacterController {
  private readonly logger = new Logger(CharacterController.name);
  constructor(private readonly characterService: CharacterService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => Character)
  async createCharacter(@Args('CreateCharacter') body: CreateCharacterDto) {
    this.logger.log(`Creating character for user ${body.userId}`);
    return this.characterService.createCharacter(
      body.name,
      body.userId,
      body.teamId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Query((returns) => Character)
  async getCharacterByOwner(
    @Args('id') id: string,
    @Args('team') team: string,
  ) {
    this.logger.log(`Getting characters for user ${id}`);
    return await this.characterService.findCharacterByOwner(id, team);
  }

  @UseGuards(JwtAuthGuard)
  @Query((returns) => [Character])
  async getCharacters() {
    this.logger.log('Getting all characters');
    return await this.characterService.findAllCharacters();
  }

  @UseGuards(JwtAuthGuard)
  @Query((returns) => Character)
  async getCharacterById(@Args('id') id: string) {
    this.logger.log(`Getting character ${id}`);
    return await this.characterService.findCharacterById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => CombatEnd)
  async combat(@Args('info') body: CombatInput) {
    this.logger.log(`Combat between ${body.attackerId} and ${body.defenderId}`);
    return await this.characterService.combat(body.attackerId, body.defenderId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => GraphQLJSON)
  async deleteCharacter(@Args('id') id: string) {
    this.logger.log(`Deleting character ${id}`);
    return await this.characterService.deleteCharacter(id);
  }
}
