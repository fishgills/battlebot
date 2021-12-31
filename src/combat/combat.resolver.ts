import { DiceRoll } from '@dice-roller/rpg-dice-roller';
import { Inject } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CharacterModel } from 'src/characters/character.model';
import { CharacterService } from 'src/characters/character.service';
import { CombatLog, CombatRound, modifier } from 'src/dnd';
import { CombatModel } from './combat.model';
import { CombatService } from './combat.service';

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
  async createCombat() {
    return await this.combatService.create();
  }

  @Mutation(() => CombatLog)
  async start(
    @Args('combatId', {
      type: () => String,
      nullable: false,
    })
    combatId: string,
  ) {
    const combat = await this.combatService.findOne(combatId);
    if (combat.log) {
      throw new Error(`Combat has already concluded for ${combatId}`);
    }

    const log = new CombatLog();
    combat.participants.sort((a, b) => {
      const aRoll = new DiceRoll('d20');
      const bRoll = new DiceRoll('d20');
      const aTotal = aRoll.total + modifier(a.dex);
      const bTotal = bRoll.total + modifier(b.dex);

      console.log(
        `Initiative Rolls: A(${a.name}): ${aRoll.total} + ${modifier(
          a.dex,
        )} = ${aTotal}. B(${b.name}): ${bRoll.total} + ${modifier(
          b.dex,
        )} = ${bTotal}`,
      );
      return bTotal - aTotal;
    });

    let max = 20;

    while (max > 0) {
      max--;
      console.log(`Combat Rounds Left: ${max}`);
      console.log(
        combat.participants.map((c) => `${c.name}:${c.hp}`).join(' - '),
      );

      if (combat.participants.filter((c) => c.hp > 0).length !== 2) {
        console.log(`Combat end due to defeat of character.`);
        break;
      }
      this.battleRound(combat, log);
    }
    await this.combatService.updateLog(combat.id, log);
    return log;
  }

  private battleRound(combat: CombatModel, log: Partial<CombatLog>) {
    const attackerResult = this.attack(
      combat.participants[0],
      combat.participants[1],
      log,
    );
    if (combat.participants[1].hp <= 0) {
      return;
    }
    const defenderResult = this.attack(
      combat.participants[1],
      combat.participants[0],
      log,
    );
  }

  private attack(
    attacker: CharacterModel,
    defender: CharacterModel,
    log: Partial<CombatLog>,
  ) {
    const attackRoll = new DiceRoll('d20').total;
    const attackModifier = modifier(attacker.str);
    const defenderAC = 10 + modifier(defender.dex);

    console.log(
      `${
        attacker.name
      } Rolled ${attackRoll} with modifer of ${attackModifier} is attacking ${
        defender.name
      } with an AC of ${10 + modifier(defender.dex)}`,
    );
    let roundLog: CombatRound;

    if (
      (attackRoll > 1 && attackRoll + attackModifier > defenderAC) ||
      attackRoll === 20
    ) {
      console.log('hit!');
      const damage = Math.max(new DiceRoll('1d6').total + attackModifier, 0);
      console.log(damage, ' damage done.');
      defender.hp = defender.hp - damage;
      roundLog = {
        attackRoll,
        attackModifier,
        attacker,
        defender,
        defenderAC,
        hit: true,
        damage,
      };
    } else {
      console.log('miss');
      roundLog = {
        attackModifier,
        attackRoll,
        attacker,
        defender,
        defenderAC,
        hit: false,
      };
    }
    if (!log.combat) {
      log.combat = [];
    }
    log.combat.push(roundLog);
  }
  @Mutation(() => CombatModel, {
    name: 'addCombatToCharacter',
  })
  addtoCharater(
    @Args('combatId', {
      type: () => String,
      nullable: false,
    })
    combatId: string,
    @Args('characterId', {
      type: () => String,
      nullable: false,
    })
    charId: string,
  ) {
    return this.combatService.addToCharacter(combatId, charId);
  }
}
