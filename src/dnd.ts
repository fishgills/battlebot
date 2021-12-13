import { DiceRoll } from '@dice-roller/rpg-dice-roller';
import { Character } from './entities/character';

export const modifier = (value: number) => {
  return Math.floor((value - 10) / 2);
};

export const getHitPoints = (char: Character) => {
  const roll = new DiceRoll('1d10');
  return roll.total + modifier(char.con);
};
