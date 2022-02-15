import { DiceRoll } from '@dice-roller/rpg-dice-roller';
import { Inject } from '@nestjs/common';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { subMinutes } from 'date-fns';

import { MoreThan } from 'typeorm';
import { CharacterModel } from '../characters/character.model';
import { CharacterService } from '../characters/character.service';
import { CombatLog, CombatRound, modifier } from '../gamerules';
import { CombatModel } from './combat.model';
import { CombatService } from './combat.service';
import { CreateCombatInput } from './dto/create-combat.input';

@Resolver((of) => CombatModel)
export class CombatResolver {
  constructor(
    @Inject(CombatService) private combatService: CombatService,
    @Inject(CharacterService) private charService: CharacterService,
  ) {}

  @Query((returns) => [CombatModel])
  async combats() {
    return this.combatService.findAll();
  }

  @Mutation((returns) => CombatModel)
  async createCombat(
    @Args('input')
    input: CreateCombatInput,
  ) {
    return await this.combatService.create(input);
  }

  @Mutation(() => CombatModel)
  async start(
    @Args('input')
    input: CreateCombatInput,
  ) {
    // const combatCount = await this.combatService.findAll({
    //   where: [
    //     {
    //       attackerId: input.attackerId,
    //       created_at: MoreThan(subMinutes(new Date(), 1).toISOString()),
    //     },
    //     {
    //       defenderId: input.attackerId,
    //       created_at: MoreThan(subMinutes(new Date(), 1).toISOString()),
    //     },
    //   ],
    // });

    // if (combatCount.length > 0) {
    //   throw new Error(`Combat started too fast`);
    // }

    let combat = await this.combatService.create(input);

    combat = await this.combatService.findOne(combat.id, {
      relations: ['attacker', 'defender'],
    });

    const log = new CombatLog();
    const participants: CharacterModel[] = [combat.attacker, combat.defender];

    participants.sort((a, b) => {
      const aRoll = new DiceRoll('d20');
      const bRoll = new DiceRoll('d20');
      const aTotal = aRoll.total + modifier(a.defense);
      const bTotal = bRoll.total + modifier(b.defense);

      console.log(
        `Who's first Rolls: A(${a.name}): ${aRoll.total} + ${modifier(
          a.defense,
        )} = ${aTotal}. B(${b.name}): ${bRoll.total} + ${modifier(
          b.defense,
        )} = ${bTotal}`,
      );
      return bTotal - aTotal;
    });

    let max = 20;

    while (max > 0) {
      max--;
      console.log(`Combat Rounds Left: ${max}`);
      console.log(participants.map((c) => `${c.name}:${c.hp}`).join(' - '));

      if (participants.filter((c) => c.hp > 0).length !== 2) {
        console.log(`Combat end due to defeat of character.`);
        break;
      }
      this.battleRound(participants, log);
    }
    combat.log = log;
    await this.combatService.updateLog(combat.id, log);

    combat.rewardGold = new DiceRoll('4d6kh2').total;
    combat.winner = log.combat[log.combat.length - 1].attacker;
    combat.loser = log.combat[log.combat.length - 1].defender;
    combat.winner.gold = combat.winner.gold += combat.rewardGold;
    combat.winner.xp = combat.winner.xp += combat.loser.level * 100;

    await this.charService.update(combat.winner.id, combat.winner);
    await this.combatService.update(combat.id, combat);

    return combat;
  }

  private battleRound(participants: CharacterModel[], log: Partial<CombatLog>) {
    this.attack(participants[0], participants[1], log);
    if (participants[1].hp <= 0) {
      return;
    }
    this.attack(participants[1], participants[0], log);
  }

  private attack(
    attacker: CharacterModel,
    defender: CharacterModel,
    log: Partial<CombatLog>,
  ) {
    const attackRoll = new DiceRoll('d20').total;
    const attackModifier = modifier(attacker.strength);
    const defenderDefense = 10 + modifier(defender.defense);

    console.log(
      `${
        attacker.name
      } Rolled ${attackRoll} with modifer of ${attackModifier} is attacking ${
        defender.name
      } with an AC of ${10 + modifier(defender.defense)}`,
    );
    let roundLog: CombatRound;

    if (
      (attackRoll > 1 && attackRoll + attackModifier > defenderDefense) ||
      attackRoll === 20
    ) {
      console.log('hit!');
      let roll = '1d6';
      if (attackRoll == 20) {
        roll = '2d6';
      }
      const damage = Math.max(new DiceRoll(roll).total + attackModifier, 0);
      console.log(damage, ' damage done.');
      defender.hp = defender.hp - damage;
      roundLog = {
        attackRoll,
        attackBonus: attackModifier,
        attacker,
        defender,
        defenderDefense: defenderDefense,
        hit: true,
        defenderHealth: defender.hp,
        damage,
      };
    } else {
      console.log('miss');
      roundLog = {
        attackBonus: attackModifier,
        attackRoll,
        attacker,
        defender,
        defenderDefense: defenderDefense,
        defenderHealth: defender.hp,
        hit: false,
      };
    }
    if (!log.combat) {
      log.combat = [];
    }
    log.combat.push(roundLog);
  }
}
