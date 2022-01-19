import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { TavernComponent } from './tavern.component';

const routes: Routes = [
  {
    path: '',
    component: TavernComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'character',
        loadChildren: () =>
          import('./character/character.module').then((m) => m.CharacterModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TavernRoutingModule {}
