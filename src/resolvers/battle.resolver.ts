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
import { Inject, Service } from 'typedi';
import { Participant } from '../entities/participant';
import { Battle } from '../entities/battle';
import { DiceRoll } from '@dice-roller/rpg-dice-roller';
import { Character } from '../entities/character';
import { Combat } from '../entities/combat';
import { idText } from 'typescript';
import { log } from 'console';

@Service()
@Resolver((of) => Battle)
export class BattleResolver implements ResolverInterface<Battle> {
  constructor(
    @InjectRepository(Battle)
    private readonly repo: Repository<Battle>,
    @InjectRepository(Participant)
    private readonly pRepo: Repository<Participant>,
    @InjectRepository(Character)
    private readonly cRepo: Repository<Character>,
    @InjectRepository(Combat)
    private readonly combatReport: Repository<Combat>,
  ) {}

  @Query((returns) => Battle)
  async battle(@Arg('id', (type) => Int) charId: number) {
    return this.repo.findOne(charId);
  }

  @Query(() => [Battle])
  async battles() {
    return this.repo.find();
  }

  @Mutation((returns) => Battle)
  async addBattle() {
    const obj = this.repo.create();
    return await this.repo.save(obj);
  }

  @FieldResolver()
  async participating(@Root() root: Battle) {
    const ps = await this.pRepo.find({
      where: {
        battle: { id: root.id },
      },
    });
    if (!ps) {
      throw new Error(`couldn't find char -> ps`);
    }
    return ps;
  }
}
