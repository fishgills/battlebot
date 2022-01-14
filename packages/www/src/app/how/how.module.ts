import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HowRoutingModule } from './how-routing.module';
import { HowComponent } from './how.component';


@NgModule({
  declarations: [
    HowComponent
  ],
  imports: [
    CommonModule,
    HowRoutingModule
  ]
})
export class HowModule { }
