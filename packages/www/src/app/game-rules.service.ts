import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameRulesService {
  modifier = (value: number) => {
    return Math.floor((value - 10) / 2);
  };
}
