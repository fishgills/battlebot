import { CharacterModel } from './character.model';
import { CharacterService } from './character.service';
import { CreateCharacterInput } from './create-character.dto';
export declare class CharacterResolver {
    private charService;
    constructor(charService: CharacterService);
    characters(): Promise<CharacterModel[]>;
    findByOwner(owner: string): Promise<CharacterModel>;
    reroll(id: string): Promise<CharacterModel>;
    createCharacter(input: CreateCharacterInput): Promise<CharacterModel>;
}
