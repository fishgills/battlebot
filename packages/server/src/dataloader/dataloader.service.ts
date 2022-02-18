import { Injectable } from '@nestjs/common';
import { IDataloaders } from './dataloader.interface';
import DataLoader from 'dataloader';
import { CharacterService } from 'characters/character.service';
import { CharacterType } from 'characters/character.type';
import { CombatModel } from 'combat/combat.model';
import { CombatService } from 'combat/combat.service';

@Injectable()
export class DataloaderService {
  constructor(
    private readonly service: CharacterService,
    private readonly combatService: CombatService,
  ) {}
  createLoaders(): IDataloaders {
    const combatLoader = new DataLoader<string, CombatModel>(
      (keys: string[]) => {
        return this.combatService.findByIds(keys);
      },
    );

    const characterLoader = new DataLoader<string, CharacterType>(
      (keys: string[]) => {
        return this.service.findByIds(keys);
      },
    );
    return {
      characterLoader,
      combatLoader,
    };
  }
}
