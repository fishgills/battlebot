import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { filter } from 'rxjs/operators';
import { authCodeFlowConfig } from './auth-code-flow.config';
import { authConfig } from './auth-config';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'www';
  constructor(private router: Router, private oauth: OAuthService) {
    // if (sessionStorage.getItem('flow') === 'code') {
    //   this.configureCodeFlow();
    // } else {
    //   this.configureImplicitFlow();
    // }

    this.oauth.initCodeFlow();
    this.oauth.configure(authCodeFlowConfig);
    const currentUrl = new URL(window.location.href);
    this.oauth
      .loadDiscoveryDocument(
        currentUrl.protocol +
          '//' +
          currentUrl.hostname +
          '/assets/open-id-config.json'
      )
      .then((value) => {
        return this.oauth.tryLogin();
      });
    this.oauth.events
      .pipe(filter((e) => e.type === 'token_received'))
      .subscribe((_) => {
        console.debug('state', this.oauth.state);
        this.oauth.loadUserProfile();
        const scopes = this.oauth.getGrantedScopes();
        console.debug('scopes', scopes);
      });
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
