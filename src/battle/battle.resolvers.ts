import {
  InjectAssemblerQueryService,
  QueryService,
  InjectQueryService,
  mergeQuery,
} from '@nestjs-query/core';
import { Args, Query, Resolver, Mutation, ID } from '@nestjs/graphql';
import { BattleAssembler } from './battle.assembler';
import { BattleDto } from './battle.dto';
import { BattleEntity } from './battle.entity';
import { BattleService } from './battle.service';
import { TLogEntry } from './types';
import { DiceRoll } from '@dice-roller/rpg-dice-roller';
import { modifier } from 'src/utils/dnd';
import { CharacterEntity } from 'src/character/character.entity';
import { CRUDResolver, ConnectionType } from '@nestjs-query/query-graphql';
import { ParticipantEntity } from 'src/participant/participant.entity';
import { ParticipantDto } from 'src/participant/participant.dto';
import { BattleLogScalar } from 'src/common/custom-log.scalar';

@Resolver(() => BattleDto)
export class BattleResolver extends CRUDResolver(BattleDto) {
  //   constructor(
  //     @InjectAssemblerQueryService(BattleAssembler)
  //     readonly service: QueryService<BattleEntity>,
  //   ) {}

  //   constructor(readonly service: BattleService) {}

  constructor(
    @InjectQueryService(BattleEntity)
    readonly service: QueryService<BattleDto>,
    @InjectQueryService(ParticipantEntity)
    readonly pService: QueryService<ParticipantDto>,
  ) {
    super(service);
  }

  @Mutation(() => BattleLogScalar)
  async doBattle(
    @Args('input', { type: () => ID }) id: number,
  ): Promise<TLogEntry[]> {
    const battle = await this.service.findById(id);
    const participants = await Promise.all(
      (
        await this.service.queryRelations(
          ParticipantEntity,
          'participants',
          battle,
          {},
        )
      ).map(async (value) => {
        const pDTO = await this.pService.findById(value.id);

        return await this.pService.findRelation(
          CharacterEntity,
          'character',
          pDTO,
        );
      }),
    );
    const log: TLogEntry[] = [];

    const order = participants
      .map((value) => {
        const abilityRoll = new DiceRoll('d20');
        return {
          initiative: abilityRoll.total + modifier(value.dex),
          char: value,
        };
      })
      .sort((a, b) => a.initiative - b.initiative)
      .map((value) => value.char) as [CharacterEntity, CharacterEntity];

    let max = 1000;

    while (Math.min(...order.map((value) => value.hp)) > 0 && max > 0) {
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
    }
    log.push(this.doAttack(defender, attacker));
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
