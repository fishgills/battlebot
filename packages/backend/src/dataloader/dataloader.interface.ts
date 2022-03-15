import { CharacterType } from 'characters/character.type';
import { CombatModel } from 'combat/combat.model';
import DataLoader from 'dataloader';

export interface IDataloaders {
  characterLoader: DataLoader<string, CharacterType>;
  combatLoader: DataLoader<string, CombatModel>;
}
