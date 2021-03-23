import { App, LogLevel } from '@slack/bolt';
import AWS from 'aws-sdk';
import { DynamoStore } from './conversation-store';
import * as dotenv from 'dotenv';
import { MessageHandler } from './message_handler';
import { CharacterWizard } from './character/creator';

dotenv.config();

AWS.config.update({
  region: 'us-west-2',
});

const app = new App({
  token: process.env['SLACK_TOKEN'],
  signingSecret: process.env['SLACK_SIGNING_SECRET'],
  convoStore: new DynamoStore(),
  logLevel: LogLevel.DEBUG,
});

MessageHandler.init();

app.message('create', CharacterWizard.start);

// app.message('hello', MessageHandler.event);

(async () => {
  // Start your app
  await app.start(3000);

  console.log('⚡️ Bolt app is running!');
})();
