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
    return await this.charRepo.save(char);
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
