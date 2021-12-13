import { Combat } from '../entities/combat';
import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  ResolverInterface,
  Root,
} from 'type-graphql';
import { Service } from 'typedi';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Battle } from '../entities/battle';
import { Participant } from '../entities/participant';
import { DiceRoll } from '@dice-roller/rpg-dice-roller';
import { Character } from '../entities/character';

type ShortCombat = Omit<
  Combat,
  'attackerId' | 'created' | 'updated' | 'defenderId' | 'battleId' | 'id'
>;

@Service()
@Resolver((of) => Combat)
export class CombatResolver implements ResolverInterface<Combat> {
  constructor(
    @InjectRepository(Combat) readonly repo: Repository<Combat>,
    @InjectRepository(Battle) readonly bRepo: Repository<Battle>,
    @InjectRepository(Character) readonly charRepo: Repository<Character>,
    @InjectRepository(Participant) readonly pRepo: Repository<Participant>,
  ) {}
  @Query(() => Combat)
  async combat(@Arg('id') id: string) {
    return await this.repo.findOne(id);
  }

  @FieldResolver()
  attacker(@Root() combat: Combat) {
    return this.charRepo.findOne(combat.attackerId);
  }
  @FieldResolver()
  defender(@Root() combat: Combat) {
    return this.charRepo.findOne(combat.defenderId);
  }
  @FieldResolver()
  battle(@Root() combat: Combat) {
    return this.bRepo.findOne(combat.battleId);
  }

  @Mutation(() => [Combat])
  async doCombat(@Arg('battleId') id: number) {
    const log: Combat[] = [];

    const battle = await this.bRepo.findOne(id);
    const participants = await this.pRepo.find({
      relations: ['character'],
      where: {
        battle: {
          id,
        },
      },
    });

    const order = participants
      .map((value) => {
        const abilityRoll = new DiceRoll('d20');
        return {
          initiative: abilityRoll.total + this.modifier(value.character.dex),
          char: value.character,
        };
      })
      .sort((a, b) => a.initiative - b.initiative)
      .map((value) => value.char) as [Character, Character];

    let max = 20;

    while (max > 0) {
      max--;
      const healths = order.map((value) => value.hp);
      if (this.returnLess(healths, 1).length !== 0) {
        break;
      }
      this.battleRound(order, battle, log);
    }

    const res = await this.repo.save(log);
    return res;
  }

  private returnLess = (arr: number[], target: number) =>
    arr.filter((n) => n < target);
  private returnLarger = (arr: number[], target: number) =>
    arr.filter((n) => n > target);

  private battleRound(
    [attacker, defender]: [Character, Character],
    battle: Battle,
    log: Combat[],
  ) {
    const result = this.doAttack(attacker, defender);
    log.push(
      this.logAttack({
        attacker,
        defender,
        battle,
        attackModifier: result.attackModifier,
        attackRoll: result.attackRoll,
        damage: result.damage,
        hit: result.hit,
      }),
    );

    if (defender.hp <= 0) {
      return;
    }

    const log2 = this.doAttack(defender, attacker);

    log.push(
      this.logAttack({
        attacker: defender,
        defender: attacker,
        battle,
        attackModifier: log2.attackModifier,
        attackRoll: log2.attackRoll,
        damage: log2.damage,
        hit: log2.hit,
      }),
    );
    return;
  }

  private logAttack(entity: ShortCombat) {
    const combat = this.repo.create(entity);
    // await this.repo.save(combat);
    return combat;
  }

  private doAttack(char1: Character, char2: Character) {
    const logEntry = {
      hit: false,
      attackRoll: 0,
      attackModifier: 0,
      damage: 0,
    };
    const attackRoll = new DiceRoll('d20').total;
    logEntry.attackRoll = attackRoll;
    logEntry.attackModifier = this.modifier(char1.str);

    if (
      (attackRoll > 1 &&
        logEntry.attackRoll + logEntry.attackModifier >
          10 + this.modifier(char2.dex)) ||
      attackRoll === 20
    ) {
      logEntry.hit = true;
      logEntry.damage = Math.max(
        new DiceRoll('1d4').total + logEntry.attackModifier,
        0,
      );
      char2.hp = char2.hp - logEntry.damage;
    }
    return logEntry;
  }

  private modifier = (value: number) => {
    return Math.floor((value - 10) / 2);
  };
}
