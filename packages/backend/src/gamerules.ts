import { DiceRoll } from '@dice-roller/rpg-dice-roller';
import { Character } from './character/character.entity';

export const modifier = (value: number) => {
  return Math.floor((value - 10) / 2);
};

export const getHitPoints = (char: Character) => {
  const roll = new DiceRoll('1d10');
  return roll.total + modifier(char.constitution);
};

export const nextLevel = (level: number) => {
  return level * 300;
};

export const levelUp = (char: Character) => {
  if (char.experiencePoints < nextLevel(char.level)) {
    return;
  }

  const hp = 6 + modifier(char.constitution);
  char.hitPoints += hp;
  char.level += 1;
  if (char.level % 2) {
    char.extraPoints += 1;
  }
};
