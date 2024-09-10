import { cleanEnv, port, str } from 'envalid';

export const env = cleanEnv(process.env, {
  SLACK_CLIENT_ID: str({
    default: '1234567890.1234567890',
  }),
  SLACK_CLIENT_SECRET: str({
    default: '1234567890abcdef1234567890abcdef',
  }),
  SLACK_SIGNING_SECRET: str({
    default: '1234567890abcdef1234567890abcdef',
  }),
  SLACK_APP_TOKEN: str({
    default: 'xapp-1234567890-1234567890-1234567890-1234567890',
  }),
  PORT: port({
    default: 4000,
  }),
  NODE_ENV: str({
    choices: ['production', 'development'],
    default: 'development',
  }),
  DD_AGENT_HOST: str({
    default: 'localhost',
  }),
  DD_TRACE_AGENT_PORT: port({
    default: 8126,
  }),
  GRAPHQL_ENDPOINT: str({
    default: 'http://localhost:3000/graphql',
  }),
});
