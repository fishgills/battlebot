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
  async addBattle(
    @Arg('attackerId', () => ID) attackerId: number,
    @Arg('defenderId', () => ID) defenderId: number,
  ): Promise<Battle> {
    const chars = await this.cRepo.findByIds([attackerId, defenderId]);
    if (chars.length !== 2) {
      throw new Error('Characters not found for battle.');
    }

    let battle = await this.repo.create();
    battle = await this.repo.save(battle);

    const result = chars.forEach(async (char) => {
      await this.pRepo.save([
        this.pRepo.create({
          battleId: battle.id,
          characterId: char.id,
        }),
      ]);
    });

    return battle;
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
