import { CharacterModel } from './characters/character.model';
export declare const modifier: (value: number) => number;
export declare const getHitPoints: (char: CharacterModel) => number;
export declare class WhoGoesFirst {
    roll: number;
    modifier: number;
}
export declare class CombatRound {
    attacker: CharacterModel;
    defender: CharacterModel;
    hit: boolean;
    damage?: number;
    attackRoll: number;
    attackBonus: number;
    defenderDefense: number;
    defenderHealth: number;
}
export declare class CombatLogInitObj {
    attacker: WhoGoesFirst;
    defender: WhoGoesFirst;
}
export declare class CombatLog {
    combat: CombatRound[];
}
