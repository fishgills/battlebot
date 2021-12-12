import { QueryArgsType } from '@nestjs-query/query-graphql';
import { ArgsType } from '@nestjs/graphql';
import { BattleDto } from './battle.dto';

@ArgsType()
export class BattleQuery extends QueryArgsType(BattleDto) {}

@ArgsType()
export class TLogEntry {
  hit: boolean;
  attackRoll: number;
  attackModifier: number;
  damage: number;
}
