import { Component, Input } from '@angular/core';
import { GameRulesService } from 'src/app/game-rules.service';
import { CharacterModel } from 'src/generated/graphql';

@Component({
  selector: 'app-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.css'],
})
export class SheetComponent {
  @Input() character!: CharacterModel;

  constructor(public gameRules: GameRulesService) {}
}
