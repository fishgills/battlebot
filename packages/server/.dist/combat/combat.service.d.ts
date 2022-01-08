import { CombatLog } from 'src/gamerules';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CharacterModel } from '../characters/character.model';
import { CombatModel } from './combat.model';
import { CreateCombatInput } from './dto/create-combat.input';
export declare class CombatService {
    combatRepo: Repository<CombatModel>;
    private charRepo;
    constructor(combatRepo: Repository<CombatModel>, charRepo: Repository<CharacterModel>);
    findAll(options?: FindManyOptions<CombatModel>): Promise<CombatModel[]>;
    findOne(id: string, options?: FindOneOptions<CombatModel>): Promise<CombatModel>;
    updateLog(combatId: string, log: CombatLog): Promise<import("typeorm").UpdateResult>;
    create(input: CreateCombatInput): Promise<{
        attackerId: string;
        defenderId: string;
    } & CombatModel>;
    getGold(attacker: CharacterModel, defender: CharacterModel): void;
    getXP(attacker: CharacterModel, defender: CharacterModel): void;
}
