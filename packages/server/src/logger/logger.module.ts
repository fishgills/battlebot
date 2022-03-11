import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import Logger, * as Bunyan from 'bunyan';
import bStream from 'bunyan-debug-stream';
import { RequestInterceptor } from './interceptor';

export const LOGGER = Symbol('LOGGER');
export const LOGGER_OPTIONS = Symbol('LOGGER_OPTIONS');

export interface LoggerConfig {
  context?: string;
}
const createBunyanLogger = (options: LoggerConfig) => {
  let logger: Logger;
  if (process.env.NODE_ENV === 'production') {
    logger = Bunyan.createLogger({
      name: 'bot',
    });
  } else {
    logger = Bunyan.createLogger({
      name: 'bot-dev',
      streams: [
        {
          level: 'debug',
          type: 'raw',
          stream: bStream({
            basepath: __dirname,
            forceColor: true,
          }),
        },
        {
          type: 'rotating-file',
          period: '1d',
          count: 3,
          path: '/tmp/server.log',
          level: 'info',
        },
      ],
    });
  }
  return logger;
};

const createRequestInterceptor = (): Provider => {
  return {
    provide: APP_INTERCEPTOR,
    inject: [LOGGER_OPTIONS, LOGGER],
    useFactory: (options: LoggerConfig, logger: Bunyan) =>
      new RequestInterceptor(options, logger),
  };
};

const createLoggerProvider = (): Provider => {
  return {
    provide: LOGGER,
    inject: [LOGGER_OPTIONS],
    useFactory: async (options: LoggerConfig) => {
      return createBunyanLogger(options);
    },
  };
};

export const createProviders = (options: LoggerConfig) => {
  const providers = [
    {
      provide: LOGGER_OPTIONS,
      useValue: options,
    },
    createLoggerProvider(),
    createRequestInterceptor(),
  ];
  return providers;
};
@Global()
@Module({})
export class LoggerModule {
  static forRoot(options: LoggerConfig): DynamicModule {
    const providers = createProviders(options);
    return {
      module: LoggerModule,
      providers,
      exports: [LOGGER],
    };
  }
}
