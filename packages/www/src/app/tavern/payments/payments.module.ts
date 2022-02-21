import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentsRoutingModule } from './payments-routing.module';
import { PaymentsComponent } from './payments.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxStripeModule } from 'ngx-stripe';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [PaymentsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PaymentsRoutingModule,
    NgxStripeModule.forChild(environment.stripe_key),
  ],
})
export class PaymentsModule {}
