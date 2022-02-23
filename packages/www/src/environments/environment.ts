// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  hostname: 'battlebot.ngrok.io',

  stripe: {
    stripe_key:
      'pk_test_51KVVrJIhYgDhNhELXnBG8vGclY1HO9CvVF1HM76nURJxEW8v1zjufMCoyDbdhP0ds94AfdZ9PzyyAWrtTxKfwnbX00xuy3GFNo',
    successUrl: 'https://api.battlebot.ngrok.io/stripe/success',
    cancelUrl: 'https://api.battlebot.ngrok.io/stripe/cancel',
    productKey: 'price_1KVVwVIhYgDhNhELoyG6NASk',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error'; // Included with Angular CLI.
