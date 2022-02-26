import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthGuard } from '../auth.guard';
import { PaymentsGuard } from './payments/payments.guard';
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
      {
        path: 'payments',
        canActivate: [PaymentsGuard],
        loadChildren: () =>
          import('./payments/payments.module').then((m) => m.PaymentsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TavernRoutingModule {}
