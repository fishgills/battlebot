import 'dotenv/config';

import {
  AllMiddlewareArgs,
  App,
  LogLevel,
  onlyCommands,
  SlackCommandMiddlewareArgs,
} from '@slack/bolt';
import { tl } from './i18n.js';
import { env } from './env.js';
import { dispatchCommand } from './dispatcher.js';
import { characterHandler } from './mention_handler/character-handler.js';
// import tracer from './tracer.js';
import { createCharacter } from './mention_handler/create-character.js';
import { StringIndexed } from '@slack/bolt/dist/types/helpers.js';
import { deleteCharacter } from './mention_handler/delete-character.js';
import { Blocks, Message, SectionBuilder } from 'slack-block-builder';
import { combatHandler } from './mention_handler/combat.js';
import { Logger } from './logger.js';
import { BotStore } from './convo-store.js';

tl.changeLanguage('en');

const scopes = ['app_mentions:read', 'commands', 'users:read'];

const app = new App({
  token: env.SLACK_APP_TOKEN,
  signingSecret: env.SLACK_SIGNING_SECRET,
  scopes,
  logger: Logger,
  extendedErrorHandler: true,
  ignoreSelf: true,
  developerMode: env.isDevelopment,
  convoStore: new BotStore(),
  appToken: env.isDevelopment ? env.SLACK_SOCKET_TOKEN : undefined,
  logLevel: env.isDevelopment ? LogLevel.INFO : LogLevel.WARN,
});

// const error: ExtendedErrorHandler = async (error) => {
//   // Check the details of the error to handle cases where you should retry sending a message or stop the app
//   console.error(`Generic Error:`);
//   console.error(error);
// };

// const app = new App({
//   clientId: env.SLACK_CLIENT_ID,
//   clientSecret: env['SLACK_CLIENT_SECRET'],
//   signingSecret: env['SLACK_SIGNING_SECRET'],
//   appToken: env['SLACK_APP_TOKEN'],
//   socketMode: false,
//   customRoutes: [
//     {
//       path: '/health',
//       method: 'GET',
//       handler: (req, res) => {
//         res.writeHead(200), res.end('UP');
//       },
//     },
//   ],
//   convoStore: new MemoryStore(),
//   logger: Logger,
//   scopes,
//   stateSecret: 'test',
//   logLevel: LogLevel.DEBUG,
//   extendedErrorHandler: true,
//   installerOptions: {
//     stateStore: new MyStateStore(),
//     stateVerification: true,
//     directInstall: true,
//   },
//   installationStore: new Store(),
// });
// app.error(error);

(async () => {
  const port = env.PORT;
  await app.start({
    port: port,
  });
  Logger.info(
    `⚡️ Bolt app is running on port ${port}! ${
      env.isDevelopment ? 'in dev mode' : ''
    }`
  );
})();

app.command(tl.t('ns1:command'), async (args) => {
  await CommandReceived(args);
});

// app.command(`${tl.t('ns1:command')}-dev`, async (args) => {
//   await CommandReceived(args.ack, args);
// });
const sources: Promise<SectionBuilder[]>[] = [
  characterHandler(app),
  createCharacter(app),
  deleteCharacter(app),
  combatHandler(app),
];

const CommandReceived = async (
  args: SlackCommandMiddlewareArgs & AllMiddlewareArgs<StringIndexed>
) => {
  const userId = args.body.user_id;
  const triggerId = args.body.trigger_id;
  const text = args.body.text.trim();

  const [action, ...flags] = text.split(' ');

  if (action == '' || action == 'help') {
    args.logger.info('Help requested');
    Promise.all(sources)
      .then((values) => {
        const blocks = values.reduce((acc, curr) => {
          return acc.concat(curr);
        }, []);

        const helpBlocks = Message()
          .blocks(
            Blocks.Section({
              text: tl.t('ns1:help_no_command'),
            }),
            ...blocks
          )
          .buildToObject();

        args.respond(helpBlocks);
      })
      .catch((e) => {
        args.logger.error(e);
      });
    return;
  }
  dispatchCommand(action, flags, userId, triggerId, args);
  args.ack();
};

// app.event('app_mention', async (args) => {
//   Shield$.next(args);
// });
// app.event('app_home_opened', async (args) => {
//   if (args.payload.tab !== 'home') return;
//   if (!args.contextl.teamId) {
//     return;
//   }
//   const content = await homePage(args.contextl.teamId, args.payload.user || '');
//   // Call views.publish with the built-in client
//   await args.client.views.publish({
//     user_id: args.event.user,
//     view: content,
//   });
// });
// app.action<BlockButtonAction>(ActionsRegex, async (args) => {
//   await args.ack();
//   Action$.next(args);
// });

app.use(async (args: any) => {
  let user: string = '';

  if (args.event) {
    user = args.event.user;
  }

  if (args.payload.user_id) {
    user = args.payload.user_id;
  }

  if (args.body && args.body.user) {
    user = args.body.user.id;
  }
  if (!user) {
    return args.next();
  }
  if (user) {
    const userInfo = await args.client.users.info({
      user,
      include_locale: true,
    });
    tl.changeLanguage(userInfo.user.locale);
  }
  args.next();
});

app.event('app_uninstalled', async (args) => {
  args.logger.info('app_uninstalled received');
  args.logger.info(args.context);
  // try {
  //   await new Store().deleteInstallation({
  //     isEnterpriseInstall: args.context.enterpriseId ? true : false,
  //     enterpriseId: args.context.enterpriseId,
  //     teamId: args.contextl.teamId,
  //   });
  // } catch (e) {
  //   Logger.error('Delete install error:');
  //   Logger.error(e);
  // }
});

// app.view('view_1', async ({ ack, body, view, client, logger }) => {
//   // Acknowledge the view_submission request
//   await ack();

//   const msg = 'There was an error with your submission';

//   logger.info('View submission', view);
// });
// app.use(async ({ payload, next }) => {
//   await tracer.trace(
//     `bolt.${(payload as any).text}`,
//     {
//       measured: false,
//     },
//     async () => {
//       await next();
//     },
//   );
// });
