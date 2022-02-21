import { Component, Input } from '@angular/core';
import { GameRulesService } from 'src/app/game-rules.service';
import { CharacterType } from 'src/generated/graphql';

@Component({
  selector: 'app-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.css'],
})
export class SheetComponent {
  @Input() character!: CharacterType;

  constructor(public gameRules: GameRulesService) {}
}
