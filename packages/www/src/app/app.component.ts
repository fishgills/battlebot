import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'www';
  constructor() {
    // if (sessionStorage.getItem('flow') === 'code') {
    //   this.configureCodeFlow();
    // } else {
    //   this.configureImplicitFlow();
    // }
  }
  // private configureImplicitFlow() {
  //   this.oauth.configure(authConfig);
  //   // this.oauthService.tokenValidationHandler = new JwksValidationHandler();

  //   this.oauth.loadDiscoveryDocument("openid-config").then(doc => this.oauth.tryLogin())
  //   this.oauth.loadDiscoveryDocumentAndTryLogin().then((_) => {
  //     // if (useHash) {
  //     this.router.navigate(['/']);
  //     // }
  //   });

  //   // Optional
  //   this.oauth.setupAutomaticSilentRefresh();

  //   // Display all events
  //   this.oauth.events.subscribe((e) => {
  //     // tslint:disable-next-line:no-console
  //     console.debug('oauth/oidc event', e);
  //   });

  //   this.oauth.events
  //     .pipe(filter((e) => e.type === 'session_terminated'))
  //     .subscribe((e) => {
  //       // tslint:disable-next-line:no-console
  //       console.debug('Your session has been terminated!');
  //     });
  // }
  // private configureCodeFlow() {
  //   this.oauth.configure(authCodeFlowConfig);
  //   this.oauth.loadDiscoveryDocumentAndTryLogin().then((_) => {
  //     // if (useHash) {
  //     this.router.navigate(['/']);
  //     // }
  //   });
  // }
}
