import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HowComponent } from './how.component';

const routes: Routes = [{ path: '', component: HowComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HowRoutingModule { }
