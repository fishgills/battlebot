import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TavernRoutingModule } from './tavern-routing.module';
import { TavernComponent } from './tavern.component';
import { SharedModule } from '../shared/shared.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [TavernComponent],
  imports: [
    CommonModule,
    TavernRoutingModule,
    SharedModule,
    MatToolbarModule,
    MatButtonModule,
  ],
})
export class TavernModule {}
