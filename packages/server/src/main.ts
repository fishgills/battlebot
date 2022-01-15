// import './tracer';
import * as dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import session from 'express-session';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DBStore } from './auth/session-store';
import { getConnection } from 'typeorm';
import { SessionModel } from './auth/session-model';
import { Logger } from '@nestjs/common';

const whitelist = ['battlebot.ngrok.io', 'slackbattlebot.com'];

async function bootstrap() {
  const ssl = process.env.SSL ? true : false;

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || whitelist.some((domain) => origin.includes(domain))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by cors'));
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  const repo = getConnection().getRepository(SessionModel);
  app.use(
    session({
      store: new DBStore({
        repository: repo,
        logger: new Logger('session-store'),
      }),
      rolling: true,
      cookie: {
        maxAge: 30 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.DOMAIN,
      },
      resave: false,
      saveUninitialized: false,
      secret: process.env.OAUTH2_CLIENT_SECRET || 'boof',
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  const port = Number(process.env.PORT) || 4000;
  const hostname = process.env.HOSTNAME || '0.0.0.0';
  await app.listen(port, hostname, () => {
    const addr =
      'http' + (ssl ? 's' : '') + '://' + hostname + ':' + port + '/';
    Logger.log('Listening at ' + addr);
  });
}
bootstrap();
