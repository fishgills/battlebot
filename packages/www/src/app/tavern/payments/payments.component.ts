import { Component, OnInit } from '@angular/core';
import { StripeService } from 'ngx-stripe';
import { switchMap, tap } from 'rxjs/operators';
import { CreateStripeSessionGQL } from 'src/generated/graphql';
import { AuthService, Userinfo } from 'src/app/auth.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})
export class PaymentsComponent implements OnInit {
  private userInfo: Userinfo;
  public environment = environment;
  constructor(
    private stripeService: StripeService,
    private service: CreateStripeSessionGQL,
    public authService: AuthService,
  ) {}
  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(
      (value) => (this.userInfo = value),
    );
  }

  checkout(priceId: string) {
    // Check the server.js tab to see an example implementation

    this.service
      .mutate({
        priceId,
        teamId: this.userInfo['https://slack.com/team_id'],
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
