export const environment = {
  production: true,
  hostname: 'slackbattlebot.com',
  gql: 'https://api.slackbattlebot.com/graphql',
  stripe: {
    stripe_key:
      'pk_live_51KVVrJIhYgDhNhELgzFu6dnAwoo5pJl0gko4SRs0ZLPSt1yQrCJGpeieJXYW9OZMoI0A1kjCV7PJtq1iVjHUbMT600kLi1y0Kz',
    successUrl: 'https://api.slackbattlebot.com/stripe/success',
    cancelUrl: 'https://api.slackbattlebot.com/stripe/cancel',
    productKey: 'price_1KW9axIhYgDhNhELD1GW3qv6',
  },
};
