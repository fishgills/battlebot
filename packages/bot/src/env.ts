import { cleanEnv, port, str } from 'envalid';

export const env = cleanEnv(process.env, {
  // SLACK_CLIENT_ID: str(),
  // SLACK_CLIENT_SECRET: str(),
  SLACK_SIGNING_SECRET: str(),
  SLACK_APP_TOKEN: str(),
  SLACK_SOCKET_TOKEN: str(),
  PORT: port({
    default: 4000,
  }),
  NODE_ENV: str({
    choices: ['production', 'development'],
    default: 'development',
  }),
  GRAPHQL_ENDPOINT: str({
    default: 'http://localhost:3000/graphql',
  }),
  CLIENT_ID: str({
    default: 'service-client-1',
  }),
  CLIENT_SECRET: str({
    default: 'dev-secret',
  }),
  OPENAI_API_KEY: str(),
});
