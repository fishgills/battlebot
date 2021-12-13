import {
  Resolver,
  Query,
  Arg,
  Int,
  FieldResolver,
  ResolverInterface,
  Root,
  Mutation,
} from 'type-graphql';
import { In, QueryResult, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Service } from 'typedi';
import { Participant } from '../entities/participant';
import { Battle } from '../entities/battle';
import { Character } from '../entities/character';
import { ParticipantInput } from './types/participant-input';

@Service()
@Resolver((of) => Participant)
export class ParticipantResolver implements ResolverInterface<Participant> {
  constructor(
    @InjectRepository(Participant)
    private readonly repo: Repository<Participant>,
    @InjectRepository(Battle) private readonly bRepo: Repository<Battle>,
    @InjectRepository(Character) private cRepo: Repository<Character>,
  ) {}

  @Query((returns) => Participant)
  participant(@Arg('id', (type) => Int) id: number) {
    return this.repo.findOne(id);
  }

  @Query((returns) => [Participant])
  participants() {
    return this.repo.find();
  }

  @Mutation((returns) => Participant)
  async addParticipant(@Arg('input') input: ParticipantInput) {
    const p = await this.repo.create({
      ...input,
    });
    return await this.repo.save(p);
  }

  @FieldResolver(() => Battle)
  async battle(@Root() root: Participant): Promise<Battle> {
    const record = await this.bRepo.findOne({
      where: {
        id: root.battleId,
      },
    });

    if (!record) {
      throw new Error(`couldn't find char -> ps`);
    }
    return record;
  }

  @FieldResolver(() => Character)
  async character(@Root() root: Participant) {
    const ps = await this.cRepo.findOne({
      where: {
        id: root.characterId,
      },
    });
    if (!ps) {
      throw new Error(`couldn't find char -> ps`);
    }
    return ps;
  }
}
