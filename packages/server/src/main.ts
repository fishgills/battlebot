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

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
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
      },
      resave: false,
      saveUninitialized: false,
      secret: process.env.OAUTH2_CLIENT_SECRET || 'boof',
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(process.env.PORT);
}
bootstrap();
