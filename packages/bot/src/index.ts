import * as dotenv from 'dotenv';
dotenv.config();

import { App, BlockAction } from '@slack/bolt';
import debug from 'debug';

import { Logger } from './logger';
import { Store } from './installation_store';
import { sdk } from './utils/gql';
import { editCharacterModal } from './views/character';
import { isGenericMessageEvent } from './utils/helpers';
import { Mention$ } from './mention_handler';
import { Shield$ } from './shield_handler';

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
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
  scopes: [
    'app_mentions:read',
    'users:read',
    'im:write',
    'im:history',
    'channels:history',
    'chat:write',
  ],
  installationStore: new Store(),
});

(async () => {
  const port = Number(process.env.PORT);
  await app.start({
    port,
  });
  Logger.info('Starting bolt');
})();

// app.event('app_mention', async (args) => {
//   Mention$.event(args);
// });

app.message(':shield:', async (args) => {
  if (!isGenericMessageEvent(args.message)) {
    return;
  }
  Shield$.event(args);
});

app.event('member_joined_channel', async (args) => {
  await args.client.chat.postMessage({
    channel: args.payload.channel,
    token: args.context.botToken,
    text:
      'Welcome <@' +
      args.payload.user +
      '>! Mention me with one of the following commands: `create <character_name`, `fight @<userToFight>`, `sheet`. For example `@DM fight @bubba` to start a fight.',
  });
});

app.event('team_join', async (args) => {
  await args.client.chat.postMessage({
    channel: args.payload.user.id,
    token: args.context.botToken,
    text: 'Welcome. Join #adventureland to start',
  });
});

app.command('/battlebot', async (args) => {
  await args.ack();
  Mention$.event(args);
});

app.event('app_home_opened', async (args) => {
  try {
    // Call views.publish with the built-in client
    await args.client.views.publish({
      // Use the user ID associated with the event
      user_id: args.event.user,
      view: {
        // Home tabs must be enabled in your app configuration page under "App Home"
        type: 'home',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*Welcome home, <@' + args.event.user + '> :house:*',
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'Learn how home tabs can be more useful and interactive <https://api.slack.com/surfaces/tabs/using|*in the documentation*>.',
            },
          },
        ],
      },
    });
  } catch (error) {
    debug(error);
  }
});

app.action<BlockAction>('reroll', async (args) => {
  try {
    let char = (
      await sdk.characterByOwner({
        owner: args.body.user.id,
        teamId: args.context.teamId,
      })
    ).findByOwner;
    args.ack();
    char = (
      await sdk.rollCharacter({
        id: char.id,
      })
    ).reroll;
    await args.client.chat.postEphemeral({
      channel: args.body.user.id,
      token: args.context.botToken,
      blocks: editCharacterModal(char),
      user: args.body.user.id,
    });
  } catch (e) {
    args.say(e.response.errors[0].message);
  }
});
