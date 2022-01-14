import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TavernRoutingModule } from './tavern-routing.module';
import { TavernComponent } from './tavern.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [TavernComponent],
  imports: [CommonModule, TavernRoutingModule, SharedModule],
})
export class TavernModule {}
