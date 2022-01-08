import { CombatModel } from 'src/combat/combat.model';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CharacterModel } from './character.model';
import { CreateCharacterInput } from './create-character.dto';
export declare class CharacterService {
    private readonly charRepo;
    private readonly combatRepo;
    constructor(charRepo: Repository<CharacterModel>, combatRepo: Repository<CombatModel>);
    create(createCharacterDto: CreateCharacterInput): Promise<CharacterModel>;
    find(options?: FindManyOptions<CharacterModel>): Promise<CharacterModel[]>;
    findAll(): Promise<CharacterModel[]>;
    findByIds(ids: string[]): Promise<CharacterModel[]>;
    findByOwner(owner: string): Promise<CharacterModel>;
    update(id: string, input: CreateCharacterInput): Promise<import("typeorm").UpdateResult>;
    findOne(options: FindOneOptions<CharacterModel>): Promise<CharacterModel>;
    rollCharacter(char: CharacterModel): void;
}
