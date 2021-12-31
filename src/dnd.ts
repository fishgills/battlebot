import { DiceRoll } from '@dice-roller/rpg-dice-roller';
import { Field, ObjectType } from '@nestjs/graphql';
import { CharacterModel } from './characters/character.model';

export const modifier = (value: number) => {
  return Math.floor((value - 10) / 2);
};

export const getHitPoints = (char: CharacterModel) => {
  const roll = new DiceRoll('1d10');
  return roll.total + modifier(char.con);
};

@ObjectType()
export class InitiativeRoll {
  @Field()
  roll: number;
  @Field()
  modifier: number;
}

@ObjectType()
export class CombatRound {
  @Field()
  attacker: CharacterModel;
  @Field()
  defender: CharacterModel;
  @Field()
  hit: boolean;
  @Field({
    nullable: true,
  })
  damage?: number;
  @Field()
  attackRoll: number;
  @Field()
  attackModifier: number;
  @Field()
  defenderAC: number;
}

@ObjectType()
export class CombatLogInitObj {
  @Field()
  attacker: InitiativeRoll;
  @Field()
  defender: InitiativeRoll;
}

@ObjectType()
export class CombatLog {
  // @Field(() => CombatLogInitObj)
  // initiativeRolls: CombatLogInitObj;
  @Field(() => [CombatRound])
  combat: CombatRound[];
}
