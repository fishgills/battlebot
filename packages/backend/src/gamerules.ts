import { DiceRoll } from '@dice-roller/rpg-dice-roller';
import { CharacterEntity } from './characters/entities/character.entity';

export const modifier = (value: number) => {
  return Math.floor((value - 10) / 2);
};

export const getHitPoints = (char: CharacterEntity) => {
  const roll = new DiceRoll('1d10');
  return roll.total + modifier(char.vitality);
};

export const nextLevel = (level: number) => {
  return level * 300;
};

export const levelUp = (char: CharacterEntity) => {
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

export class WhoGoesFirst {
  roll: number;
  modifier: number;
}

export class CombatRound {
  attacker: CharacterEntity;

  defender: CharacterEntity;

  hit: boolean;

  damage?: number;
  attackRoll: number;

  attackBonus: number;
  defenderDefense: number;
  defenderHealth: number;
}

export class CombatLogInitObj {
  attacker: WhoGoesFirst;
  defender: WhoGoesFirst;
}

export class CombatLog {
  combat: CombatRound[];
}
