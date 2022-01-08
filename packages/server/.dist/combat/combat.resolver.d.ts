import { CharacterService } from 'src/characters/character.service';
import { CombatLog } from 'src/gamerules';
import { CombatModel } from './combat.model';
import { CombatService } from './combat.service';
import { CreateCombatInput } from './dto/create-combat.input';
export declare class CombatResolver {
    private combatService;
    private charService;
    constructor(combatService: CombatService, charService: CharacterService);
    combats(): Promise<CombatModel[]>;
    createCombat(input: CreateCombatInput): Promise<{
        attackerId: string;
        defenderId: string;
    } & CombatModel>;
    start(input: CreateCombatInput): Promise<CombatLog>;
    private battleRound;
    private attack;
}
