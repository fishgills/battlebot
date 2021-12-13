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

  @Query(() => [Character])
  async characters() {
    return this.charRepo.find();
  }

  @Mutation((returns) => Character)
  async addCharacter(@Arg('character') charInput: CharacterInput) {
    const char = this.charRepo.create({
      ...charInput,
    });
    char.str = new DiceRoll('3d6').total;
    char.dex = new DiceRoll('3d6').total;
    char.con = new DiceRoll('3d6').total;
    char.level = 1;
    char.hp = 10 + modifier(char.con);
    return await this.charRepo.save(char);
  }

  @Mutation(() => Boolean)
  async removeCharacter(@Arg('id') id: number) {
    const result = await this.charRepo.delete({
      id,
    });
    return !!result.affected;
  }

  @Mutation(() => Character)
  async updateCharacter(
    @Arg('id') id: number,
    @Arg('input') input: CharacterInput,
  ) {
    const char = await this.charRepo.findOne(id);

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
}
