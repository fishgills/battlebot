import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CharacterRoutingModule } from './character-routing.module';
import { CharacterComponent } from './character.component';
import { SheetComponent } from './sheet/sheet.component';

@NgModule({
  declarations: [CharacterComponent, SheetComponent],
  imports: [CommonModule, CharacterRoutingModule],
})
export class CharacterModule {}
