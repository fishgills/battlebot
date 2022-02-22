import { Component } from '@angular/core';
import { StripeService } from 'ngx-stripe';
import { switchMap, tap } from 'rxjs/operators';
import { CreateStripeSessionGQL } from 'src/generated/graphql';
import { AuthService } from 'src/app/auth.service';
@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})
export class PaymentsComponent {
  constructor(
    private stripeService: StripeService,
    private service: CreateStripeSessionGQL,
    public authService: AuthService,
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
