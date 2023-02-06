import './tracer';
import * as dotenv from 'dotenv';
dotenv.config();
import 'axios-debug-log';
import passport from 'passport';
import session from 'express-session';
import MySQLStoreCreator from 'express-mysql-session';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as mysql2 from 'mysql2/promise';
import { Logger } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
const whitelist = [
  'battlebot.ngrok.io',
  'mediatingmediator.com',
  'studio.apollographql.com',
  'postman.co',
  'electron://altair',
  'localhost:4000',
];
const sessionLengthInMinutes = 5;
const sessionLengthInSeconds = sessionLengthInMinutes * 60;
const sessionLengthInMs = sessionLengthInSeconds * 1000;

async function bootstrap() {
  const ssl = process.env.SSL ? true : false;

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      level: process.env['NODE_ENV'] === 'production' ? 'verbose' : 'debug',
      exitOnError: false,
      format:
        process.env.NODE_ENV !== 'production'
          ? winston.format.combine(
              winston.format.colorize(),
              winston.format.simple(),
            )
          : winston.format.json(),
      transports: new winston.transports.Console(),
    }),
  });
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || whitelist.some((domain) => origin.includes(domain))) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by cors: ${origin}`));
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const connection = mysql2.createPool({
    host: process.env['DB_HOST'],
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'bot',
  });
  const sessionStore = new (MySQLStoreCreator(session as any))({}, connection);

  app.use(
    session({
      secret: process.env.OAUTH2_CLIENT_SECRET || 'boof',
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      },
    }),
  );

  // app.use(
  //   session({
  //     store: new DBStore({
  //       repository: repo,
  //       logger: new Logger('session-store'),
  //       clearExpired: true,
  //       expirationInterval: sessionLengthInMs,
  //       ttl: sessionLengthInMinutes,
  //     }),
  //     rolling: true,
  //     cookie: {
  //       maxAge: sessionLengthInMs,
  //       httpOnly: true,
  //       // secure: process.env.NODE_ENV === 'production',
  //       domain: process.env.DOMAIN,
  //       sameSite: 'lax',
  //     },
  //     resave: false,
  //     saveUninitialized: false,
  //     secret: process.env.OAUTH2_CLIENT_SECRET || 'boof',
  //   }),
  // );
  app.use(passport.initialize());
  app.use(passport.session());
  const port = Number(process.env.PORT) || 4000;
  const hostname = '0.0.0.0';
  await app.listen(port, hostname, () => {
    const addr =
      'http' + (ssl ? 's' : '') + '://' + hostname + ':' + port + '/';
    Logger.log('Listening at ' + addr);
  });
}
bootstrap();
