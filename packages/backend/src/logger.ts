import { Injectable, Scope, ConsoleLogger } from '@nestjs/common';
import * as bLogger from 'bunyan';
import bStream from 'bunyan-debug-stream';
import { format } from 'date-fns';
import { cache } from 'decorator-cache-getter';

@Injectable({ scope: Scope.TRANSIENT })
export class MyLogger extends ConsoleLogger {
  private logger: bLogger;

  @cache
  static get Logger() {
    let logger: bLogger;
    if (process.env.NODE_ENV === 'production') {
      logger = bLogger.createLogger({
        name: 'server',
        level: 'debug',
      });
    } else {
      logger = bLogger.createLogger({
        name: 'server-dev',
        streams: [
          {
            level: 'debug',
            type: 'raw',
            stream: bStream({}),
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
  }

  public constructor() {
    super();
    this.logger = MyLogger.Logger;
  }
  log(message: any) {
    this.logger.info(
      {
        time: format(new Date(), 'dd/LLL/yyyy:H:m:s XX'),
      },
      message,
    );
  }

  debug(message: any) {
    this.logger.debug(
      {
        time: format(new Date(), 'dd/LLL/yyyy:H:m:s XX'),
      },
      message,
    );
  }

  warn(message: any) {
    this.logger.warn(
      {
        time: format(new Date(), 'dd/LLL/yyyy:H:m:s XX'),
      },
      message,
    );
  }

  error(message: any) {
    this.logger.error(
      {
        time: format(new Date(), 'dd/LLL/yyyy:H:m:s XX'),
      },
      message,
    );
  }
}
