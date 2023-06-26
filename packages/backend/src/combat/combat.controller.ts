import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { CombatService } from './combat.service';
import { UpdateCombatDto } from './dto/update-combat.dto';
import { CreateCombatDto } from './dto/create-combat.dto';
import { DiceRoll } from '@dice-roller/rpg-dice-roller';
import { CombatLog, CombatRound, levelUp, modifier } from 'src/gamerules';
import { CharactersService } from 'src/characters/characters.service';
import { CharacterEntity } from 'src/characters/entities/character.entity';
import { CombatEntity } from './entities/combat.entity';

@Controller('combat')
export class CombatController {
  constructor(
    private readonly combatService: CombatService,
    private readonly charService: CharactersService,
    private logger: Logger,
  ) {}

  @Post()
  create(@Body() createCombatDto: CreateCombatDto) {
    return this.combatService.create(createCombatDto);
  }

  @Get()
  findAll() {
    return this.combatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.combatService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCombatDto: UpdateCombatDto) {
    return this.combatService.update(id, updateCombatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.combatService.remove(id);
  }

  @Post('start')
  async start(
    @Body('input')
    input: CreateCombatDto,
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
    const participants: CharacterEntity[] = [combat.attacker, combat.defender];

    participants.sort((a, b) => {
      const aRoll = new DiceRoll('d20');
      const bRoll = new DiceRoll('d20');
      const aTotal = aRoll.total + modifier(a.defense);
      const bTotal = bRoll.total + modifier(b.defense);

      this.logger.log(
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
      this.logger.log(`Combat Rounds Left: ${max}`);
      this.logger.log(participants.map((c) => `${c.name}:${c.hp}`).join(' - '));

      if (participants.filter((c) => c.hp > 0).length !== 2) {
        this.logger.log(`Combat end due to defeat of character.`);
        break;
      }
      this.battleRound(participants, log);
    }
    combat.log = log;
    await this.combatService.updateLog(combat.id, log);
    combat.rewardGold = new DiceRoll('4d6kh2').total;
    await this.combatService.update(combat.id, combat);

    const winner = await this.charService.findOne(
      log.combat[log.combat.length - 1].attacker.id,
    );
    const loser = await this.charService.findOne(
      log.combat[log.combat.length - 1].defender.id,
    );

    winner.gold = winner.gold += combat.rewardGold;
    winner.xp = winner.xp += Math.floor(
      (loser.level / winner.level) * new DiceRoll('20d10').total,
    );
    levelUp(winner);
    await this.charService.update(winner.id, winner);

    combat.winner = winner;
    combat.loser = loser;
    return combat;
  }

  private battleRound(
    participants: CharacterEntity[],
    log: Partial<CombatLog>,
  ) {
    this.attack(participants[0], participants[1], log);
    if (participants[1].hp <= 0) {
      return;
    }
    this.attack(participants[1], participants[0], log);
  }

  private attack(
    attacker: CharacterEntity,
    defender: CharacterEntity,
    log: Partial<CombatLog>,
  ) {
    const attackRoll = new DiceRoll('d20').total;
    const attackModifier = modifier(attacker.strength);
    const defenderDefense = 10 + modifier(defender.defense);

    this.logger.log(
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
      this.logger.log('hit!');
      let roll = '1d6';
      if (attackRoll == 20) {
        roll = '2d6';
      }
      const damage = Math.max(new DiceRoll(roll).total + attackModifier, 0);
      this.logger.log(damage, ' damage done.');
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
      this.logger.log('miss');
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
