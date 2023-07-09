import './tracer';
import 'dotenv/config';
import { gab, t } from './locale';

gab.init({
  supportedLocales: ['en-us'],
  locale: 'en-us',
});

import {
  App,
  BlockButtonAction,
  HTTPReceiver,
  LogLevel,
  MemoryStore,
} from '@slack/bolt';
import { Command$ } from './mention_handler';
import { Action$, ActionsRegex } from './actions';
import { Shield$ } from './reward_handler';
import { homePage } from './views/home';
import { Logger } from './logger';
import { Store } from './installation_store';
import tracer from 'dd-trace';
import { MyStateStore } from './state_store';
import { ErrorHandler, ExtendedErrorHandler } from '@slack/bolt/dist/App';
import { loggers } from 'winston';

const scopes = ['app_mentions:read', 'commands', 'users:read'];

const error: ExtendedErrorHandler = async (error) => {
  // Check the details of the error to handle cases where you should retry sending a message or stop the app
  console.error(`Generic Error:`);
  console.error(error);
};

const app = new App({
  clientId: process.env['SLACK_CLIENT_ID'],
  clientSecret: process.env['SLACK_CLIENT_SECRET'],
  signingSecret: process.env['SLACK_SIGNING_SECRET'],
  appToken: process.env['SLACK_APP_TOKEN'],
  socketMode: true,
  customRoutes: [
    {
      path: '/health',
      method: 'GET',
      handler: (req, res) => {
        res.writeHead(200), res.end('UP');
      },
    },
  ],
  convoStore: new MemoryStore(),
  logger: Logger,
  scopes,
  stateSecret: 'test',
  logLevel: LogLevel.DEBUG,
  extendedErrorHandler: true,
  installerOptions: {
    stateStore: new MyStateStore(),
    stateVerification: true,
    directInstall: true,
  },
  installationStore: new Store(),
});
app.error(error);

(async () => {
  const port = Number(process.env.PORT);
  Logger.info(`Got ${port} for port.`);
  await app.start({
    port: port,
  });
  Logger.info(`Starting mode: ${process.env.NODE_ENV}`);
  Logger.info(`Starting bolt with port: ${port}`);
})();

app.command(t('command'), async (args) => {
  await args.ack();
  Command$.next(args);
});

app.command(`${t('command')}-dev`, async (args) => {
  await args.ack();
  Command$.next(args);
});

app.event('app_mention', async (args) => {
  Shield$.next(args);
});
app.event('app_home_opened', async (args) => {
  if (args.payload.tab !== 'home') return;
  const content = await homePage(args.context.teamId, args.payload.user);
  // Call views.publish with the built-in client
  await args.client.views.publish({
    user_id: args.event.user,
    view: content,
  });
});
app.action<BlockButtonAction>(ActionsRegex, async (args) => {
  await args.ack();
  Action$.next(args);
});

app.use(async (args: any) => {
  let user: string;

  if (args.event) {
    user = args.event.user;
  }

  if (args.payload.user_id) {
    user = args.payload.user_id;
  }

  if (args.body && args.body.user) {
    user = args.body.user.id;
  }
  if (user) {
    const userInfo = await args.client.users.info({
      user,
      include_locale: true,
    });
    gab.setLocale(userInfo.user.locale);
  }
  args.next();
});

app.event('app_uninstalled', async (args) => {
  Logger.info('app_uninstalled received');
  Logger.info(args.context);
  try {
    await new Store().deleteInstallation({
      isEnterpriseInstall: args.context.enterpriseId ? true : false,
      enterpriseId: args.context.enterpriseId,
      teamId: args.context.teamId,
    });
  } catch (e) {
    Logger.error('Delete install error:');
    Logger.error(e);
  }
});

app.use(async ({ payload, next }) => {
  await tracer.trace(
    `bolt.${(payload as any).text}`,
    {
      measured: false,
    },
    async () => {
      await next();
    },
  );
});
