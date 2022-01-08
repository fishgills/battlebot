import { CombatLog } from 'src/gamerules';
import { CharacterModel } from '../characters/character.model';
export declare class CombatModel {
    id: string;
    attacker: CharacterModel;
    attackerId: string;
    defender: CharacterModel;
    defenderId: string;
    log: CombatLog;
    created_at: Date;
    updated_at: Date;
}
