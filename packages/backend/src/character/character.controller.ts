import { UseGuards, Logger } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CreateCharacterDto } from './DTO/create-character.dto';
import { CombatInput } from './DTO/combat.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Character } from './character.entity';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CombatEnd } from './combat-type.dto';
import GraphQLJSON from 'graphql-type-json';
import { UpdateCharacterDto } from './DTO/update-character.dto';

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

  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => Character)
  async reroll(@Args('id') id: string) {
    this.logger.log(`Rerolling character ${id}`);
    const char = await this.characterService.findCharacterById(id);
    if (char.rolls >= 5) {
      throw new Error('You have already rerolled 5 times');
    }
    char.rollCharacter();
    if (char.rolls === 5) {
      char.active = new Date();
    }
    await this.characterService.updateCharacterStats(id, char);
    return char;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation((returns) => Character)
  async updateCharacter(
    @Args('id') id: string,
    @Args('input') input: UpdateCharacterDto,
  ) {
    this.logger.log(`Updating character ${id}`);
    return await this.characterService.updateCharacterStats(id, input);
  }

  // @UseGuards(JwtAuthGuard)
  // @Mutation(() => CombatEnd)
  // async startCombat(@Args('id1') id1: string, @Args('id2') id2: string) {
  //   this.logger.log(`Starting combat`);
  //   return await this.characterService.combat(id1, id2);
  // }
}
