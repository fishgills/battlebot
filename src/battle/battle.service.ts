import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { BattleEntity } from './battle.entity';
import { QueryService } from '@nestjs-query/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CharacterEntity } from 'src/character/character.entity';
import { DiceRoll } from '@dice-roller/rpg-dice-roller';
import { modifier } from 'src/utils/dnd';
import { ParticipantDto } from 'src/participant/participant.dto';
import { ParticipantEntity } from 'src/participant/participant.entity';
import { BattleDto } from './battle.dto';

type TLogEntry = {
  hit: boolean;
  attackRoll: number;
  attackModifier: number;
  damage: number;
};

@QueryService(BattleEntity)
export class BattleService extends TypeOrmQueryService<BattleEntity> {
  constructor(@InjectRepository(BattleEntity) repo: Repository<BattleEntity>) {
    super(repo);
  }
  async doBattlee(battleId: number): Promise<TLogEntry[]> {
    // const battle = await this.repo.findOne(battleId);
    const battle = await this.findById(battleId);

    const order = battle.participants
      .map((value) => {
        const abilityRoll = new DiceRoll('d20');
        return {
          initiative: abilityRoll.total + modifier(value.character.dex),
          char: value.character,
        };
      })
      .sort((a, b) => a.initiative - b.initiative)
      .map((value) => value.char) as [CharacterEntity, CharacterEntity];

    let max = 1000;
    const log = [];

    while (Math.min(...order.map((value) => value.hp)) && max > 0) {
      max--;
      this.battleRound(order, log);
    }
    return log;
  }

  private battleRound(
    [attacker, defender]: [CharacterEntity, CharacterEntity],
    log: TLogEntry[],
  ) {
    log.push(this.doAttack(attacker, defender));
    if (defender.hp <= 0) {
      return log;
    }
    log.push(this.doAttack(defender, attacker));
    return log;
  }

  private doAttack(char1: CharacterEntity, char2: CharacterEntity) {
    const logEntry: TLogEntry = {
      hit: false,
      attackRoll: 0,
      attackModifier: 0,
      damage: 0,
    };
    const attackRoll = new DiceRoll('d20').total;
    logEntry.attackRoll = attackRoll;
    logEntry.attackModifier = modifier(char1.str);

    if (
      (attackRoll > 1 &&
        logEntry.attackRoll + logEntry.attackModifier >
          10 + modifier(char2.dex)) ||
      attackRoll === 20
    ) {
      logEntry.hit = true;
      logEntry.damage = new DiceRoll('1d4').total + logEntry.attackModifier;
      char2.hp = char2.hp - logEntry.damage;
    }
    return logEntry;
  }
}
