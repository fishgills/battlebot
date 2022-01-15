import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  loginFailed = false;
  userProfile: object | undefined;
  usePopup: boolean | undefined;
  login: false | undefined;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((p) => {
      this.login = p['login'];
    });

    // This would directly (w/o user interaction) redirect the user to the
    // login page if they are not already logged in.
    /*
        this.oauthService.loadDiscoveryDocumentAndTryLogin().then(_ => {
            if (!this.oauthService.hasValidIdToken() || !this.oauthService.hasValidAccessToken()) {
              this.oauthService.initImplicitFlow('some-state');
            }
        });
    */
  }
}
