import { Component, OnInit, ViewChild } from '@angular/core';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  StripeCardElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { switchMap, tap } from 'rxjs/operators';
import { CreateStripeSessionGQL } from 'src/generated/graphql';
@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})
export class PaymentsComponent {
  constructor(
    private http: HttpClient,
    private stripeService: StripeService,
    private service: CreateStripeSessionGQL,
  ) {}

  checkout(priceId: string) {
    // Check the server.js tab to see an example implementation

    this.service
      .mutate({
        priceId,
      })
      .pipe(
        switchMap((resp) => {
          return this.stripeService.redirectToCheckout({
            sessionId: resp.data?.CreateStripeCheckoutSession.id as string,
          });
        }),
      )
      .subscribe((result) => {
        if (result.error) {
          alert(result.error.message);
        }
      });
  }
}
