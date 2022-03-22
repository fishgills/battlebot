export const environment = {
  production: true,
  hostname: 'mediatingmediator.com',
  gql: 'https://backend.mediatingmediator.com/graphql',
  stripe: {
    enabled: true,
    stripe_key:
      'pk_live_51KVVrJIhYgDhNhELgzFu6dnAwoo5pJl0gko4SRs0ZLPSt1yQrCJGpeieJXYW9OZMoI0A1kjCV7PJtq1iVjHUbMT600kLi1y0Kz',
    successUrl: 'https://backend.mediatingmediator.com/stripe/success',
    cancelUrl: 'https://backend.mediatingmediator.com/stripe/cancel',
    productKey: 'price_1KW9axIhYgDhNhELD1GW3qv6',
  },
};
