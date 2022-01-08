import { CombatModel } from '../combat/combat.model';
export declare class CharacterModel {
    id: string;
    name: string;
    created_at: Date;
    updated_at: Date;
    owner: string;
    attacking: CombatModel[];
    defending: CombatModel[];
    strength: number;
    defense: number;
    vitality: number;
    level: number;
    xp: number;
    hp: number;
    rolls: number;
}
