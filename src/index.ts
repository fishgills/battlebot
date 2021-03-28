import { App, BlockAction, LogLevel } from '@slack/bolt';

import * as dotenv from 'dotenv';
import { MessageHandler } from './message_handler';
import sequelize from './db';
import createRelationships from './models';
import logger from './logger';
import { CharacterController } from './controllers/character';
import mw from './utils/global-char-mw';

dotenv.config();

const app = new App({
  token: process.env['SLACK_TOKEN'],
  signingSecret: process.env['SLACK_SIGNING_SECRET'],
  // convoStore: new DynamoStore(),
  logLevel: LogLevel.DEBUG,
});

app.use(mw);

MessageHandler.init();

app.command('/create', async ({ ack, body, client }) => {
  await ack();

  const wizard = new CharacterController();
  await wizard.create(client, body);
});

app.action('reroll', async ({ body, client, ack }) => {
  await ack();
  body = body as BlockAction;
  if (body.view) {
    const cont = new CharacterController();
    cont.reroll(client, body);
  }
});

(async () => {
  createRelationships();
  const client = await sequelize.sync({ force: true });
  await app.start(3000);

  logger.info('⚡️ Bolt app is running!');
})();
