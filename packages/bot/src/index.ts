import * as dotenv from 'dotenv';
dotenv.config();

import { App, BlockButtonAction, subtype } from '@slack/bolt';
import debug from 'debug';

import { Logger } from './logger';
import { Store } from './installation_store';
import { isGenericMessageEvent } from './utils/helpers';
import { Command$ } from './mention_handler';
import { Action$, ActionsRegex } from './actions';
import { Shield$ } from './reward_handler';
import { homePage } from './views/home';

const app = new App({
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  customRoutes: [
    {
      path: '/health-check',
      method: 'GET',
      handler: (req, res) => {
        res.writeHead(200), res.end('UP');
      },
    },
  ],
  developerMode: process.env.NODE_ENV !== 'production',
  logger: Logger,
  socketMode: true,
  stateSecret: 'awesome',
  scopes: ['users:read', 'channels:history', 'commands', 'chat:write'],
  installationStore: new Store(),
});

(async () => {
  const port = Number(process.env.PORT);
  const info = await app.start({
    port,
  });
  Logger.info('Starting bolt', info);
})();

app.message(':loudspeaker:', async (args) => {
  if (!isGenericMessageEvent(args.message)) {
    return;
  }
  Shield$.next(args);
});

// app.event('member_joined_channel', async (args) => {
//   await args.client.chat.postMessage({
//     channel: args.payload.channel,
//     token: args.context.botToken,
//     text:
//       'Welcome <@' +
//       args.payload.user +
//       '>! Mention me with one of the following commands: `create <character_name`, `fight @<userToFight>`, `sheet`. For example `@DM fight @bubba` to start a fight.',
//   });
// });

app.event('team_join', async (args) => {
  await args.client.chat.postMessage({
    channel: args.payload.user.id,
    token: args.context.botToken,
    text: 'Welcome. Join #adventureland to start',
  });
});

app.command('/presentator', async (args) => {
  await args.ack();
  Command$.next(args);
});

app.command('/presentator-dev', async (args) => {
  await args.ack();
  Command$.next(args);
});

app.event('app_home_opened', async (args) => {
  if (args.payload.tab !== 'home') return;
  try {
    const content = await homePage(args.context.teamId, args.payload.user);
    // Call views.publish with the built-in client
    await args.client.views.publish({
      user_id: args.event.user,
      view: content,
    });
  } catch (error) {
    debug(error);
  }
});
app.action<BlockButtonAction>(ActionsRegex, async (args) => {
  await args.ack();
  Action$.next(args);
});
