// This api will come in the next version

import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: 'https://slack.com',

  // URL of the SPA to redirect the user to after login
  // redirectUri: window.location.origin
  //   + ((localStorage.getItem('useHashLocationStrategy') === 'true')
  //     ? '/#/index.html'
  //     : '/index.html'),

  redirectUri: 'https://0c5b-73-70-164-116.ngrok.io/index.html',

  // URL of the SPA to redirect the user after silent refresh
  silentRefreshRedirectUri:
    'https://0c5b-73-70-164-116.ngrok.io/silent-refresh.html',

  // The SPA's id. The SPA is registerd with this id at the auth-server
  clientId: '1426341815603.2829208342434',

  // set the scope for the permissions the client should request
  // The first three are defined by OIDC. The 4th is a usecase-specific one
  scope: 'openid',

  // silentRefreshShowIFrame: true,

  showDebugInformation: true,

  sessionChecksEnabled: true,

  // timeoutFactor: 0.01,
};

//   href="https://slack.com/openid/connect/authorize?scope=openid&amp;response_type=code&amp;redirect_uri=https%3A%2F%2F9d3a-73-70-164-116.ngrok.io%2Fauth&amp;client_id=1426341815603.2829208342434"
