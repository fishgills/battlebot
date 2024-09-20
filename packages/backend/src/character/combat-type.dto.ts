import {
  createUnionType,
  Field,
  InterfaceType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Character } from './character.entity';

export enum CombatLogType {
  ATTACK = 'ATTACK',
  INITIATIVE = 'INITIATIVE',
  LEVELUP = 'LEVELUP',
  XPGAIN = 'XPGAIN',
}

registerEnumType(CombatLogType, {
  name: 'CombatLogType',
  description: 'The type of combat log',
});

@InterfaceType()
abstract class BaseLog {
  @Field((type) => CombatLogType)
  type: CombatLogType;
  @Field()
  round: number;
  @Field((returns) => Character)
  actor: Character;
  @Field(() => Character, {
    nullable: true,
  })
  target: Character;
}

@ObjectType()
class LevelUpDetails {
  @Field()
  newLevel: number;
}

@ObjectType({
  implements: BaseLog,
})
export class LevelUpLog extends BaseLog {
  @Field((type) => CombatLogType)
  type: CombatLogType.LEVELUP;
  @Field()
  details: LevelUpDetails;
}

@ObjectType()
class XPGainDetails {
  @Field((type) => Number)
  xp: number;
}

@ObjectType({
  implements: BaseLog,
})
export class XPGainLog extends BaseLog {
  @Field((type) => CombatLogType)
  type: CombatLogType.XPGAIN;
  @Field()
  details: XPGainDetails;
}

@ObjectType({
  implements: BaseLog,
})
export class InitiativeLog extends BaseLog {
  @Field((type) => CombatLogType)
  type: CombatLogType.INITIATIVE;
}

@ObjectType()
export class AttackDetails {
  @Field()
  attackRoll: number;
  @Field()
  attackModifier: number;
  @Field()
  defenderAc: number;
  @Field()
  hit: boolean;
  @Field()
  damage: number;
  @Field()
  defenderHitPoints: number;
}

@ObjectType({
  implements: BaseLog,
})
export class AttackLog extends BaseLog {
  @Field((type) => CombatLogType)
  type: CombatLogType.ATTACK;
  @Field()
  details: AttackDetails;
}

@ObjectType()
export class CombatEnd {
  @Field()
  winner: Character;
  @Field()
  loser: Character;
  @Field((returns) => [LogUnion])
  logs: (typeof LogUnion)[];
}

const LogUnion = createUnionType({
  name: 'LogUnion',
  types: () => [LevelUpLog, XPGainLog, InitiativeLog, AttackLog] as const,
  resolveType: (value: BaseLog) => {
    if (value.type === CombatLogType.LEVELUP) {
      return LevelUpLog;
    }
    if (value.type === CombatLogType.XPGAIN) {
      return XPGainLog;
    }
    if (value.type === CombatLogType.INITIATIVE) {
      return InitiativeLog;
    }
    if (value.type === CombatLogType.ATTACK) {
      return AttackLog;
    }
    return null;
  },
});

export type CombatLog = LevelUpLog | XPGainLog | InitiativeLog | AttackLog;
