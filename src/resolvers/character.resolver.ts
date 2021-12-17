import { Character } from '../entities/character';
import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Ctx,
  Int,
  FieldResolver,
  Root,
  ResolverInterface,
  ID,
} from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Service } from 'typedi';
import { Participant } from '../entities/participant';
import { CharacterInput } from './types/character-input';
import { getHitPoints, modifier } from '../dnd';
import { Dice, DiceRoll } from '@dice-roller/rpg-dice-roller';

@Service()
@Resolver((of) => Character)
export class CharacterResolver implements ResolverInterface<Character> {
  constructor(
    @InjectRepository(Character)
    private readonly charRepo: Repository<Character>,
    @InjectRepository(Participant)
    private readonly pRepo: Repository<Participant>,
  ) {}

  @Query((returns) => Character)
  async character(@Arg('id', (type) => Int) charId: number) {
    return this.charRepo.findOne(charId);
  }

  @Query(() => Character)
  async characterByOwner(@Arg('owner', () => String) owner: string) {
    const char = await this.charRepo.find({
      where: {
        owner,
      },
      take: 1,
    });
    return char[0] || {};
  }

  @Query(() => [Character])
  async characters() {
    return this.charRepo.find();
  }

  @Mutation((returns) => Character)
  async addCharacter(@Arg('character') charInput: CharacterInput) {
    const char = this.charRepo.create({
      ...charInput,
    });
    this.rollCharacter(char);
    char.level = 1;
    return await this.charRepo.save(char);
  }

  private rollCharacter(char: Character) {
    char.str = new DiceRoll('4d6kh3').total;
    char.dex = new DiceRoll('4d6kh3').total;
    char.con = new DiceRoll('4d6kh3').total;
    char.rolls = char.rolls ? ++char.rolls : 1;
    char.hp = 10 + modifier(char.con);
  }

  @Mutation(() => Boolean)
  async removeCharacter(@Arg('id') id: number) {
    const result = await this.charRepo.delete({
      id,
    });
    return !!result.affected;
  }

  @Mutation(() => Character)
  async reroll(@Arg('id', () => ID) id: number) {
    const char = await this.charRepo.findOne(id);
    this.rollCharacter(char);
    await this.charRepo.update({ id }, char);
    return await this.charRepo.findOne(id);
  }

  @Mutation(() => Character)
  async updateCharacter(
    @Arg('id', () => ID) id: number,
    @Arg('input') input: CharacterInput,
  ) {
    const char = await this.charRepo.findOne(id);

    this.validateAbilities(input);
    if (input.con) {
      input.hp = getHitPoints(char);
    }
    await this.charRepo.update(
      {
        id,
      },
      input,
    );
    return await this.charRepo.findOne(id);
  }

  @FieldResolver()
  async participating(@Root() char: Character) {
    const ps = await this.pRepo.find({
      where: {
        character: {
          id: char.id,
        },
      },
    });
    if (!ps) {
      throw new Error(`couldn't find char -> ps`);
    }
    return ps;
  }

  private validateAbilities(char: CharacterInput) {}
}
