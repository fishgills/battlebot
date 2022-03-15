import { DiceRoll } from '@dice-roller/rpg-dice-roller';
import { Field, ObjectType } from '@nestjs/graphql';
import { CharacterType } from './characters/character.type';

export const modifier = (value: number) => {
  return Math.floor((value - 10) / 2);
};

export const getHitPoints = (char: CharacterType) => {
  const roll = new DiceRoll('1d10');
  return roll.total + modifier(char.vitality);
};

export const nextLevel = (level: number) => {
  return level * 300;
};

export const levelUp = (char: CharacterType) => {
  if (char.xp < nextLevel(char.level)) {
    return;
  }

  const hp = 6 + modifier(char.vitality);
  char.hp += hp;
  char.level += 1;
  if (char.level % 2) {
    char.extraPoints += 1;
  }
};

@ObjectType()
export class WhoGoesFirst {
  @Field()
  roll: number;
  @Field()
  modifier: number;
}

@ObjectType()
export class CombatRound {
  @Field()
  attacker: CharacterType;
  @Field()
  defender: CharacterType;
  @Field()
  hit: boolean;
  @Field({
    nullable: true,
  })
  damage?: number;
  @Field()
  attackRoll: number;
  @Field()
  attackBonus: number;
  @Field()
  defenderDefense: number;
  @Field()
  defenderHealth: number;
}

@ObjectType()
export class CombatLogInitObj {
  @Field()
  attacker: WhoGoesFirst;
  @Field()
  defender: WhoGoesFirst;
}

@ObjectType()
export class CombatLog {
  @Field(() => [CombatRound])
  combat: CombatRound[];
}
