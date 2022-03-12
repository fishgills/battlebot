import { Injectable, Scope, ConsoleLogger } from '@nestjs/common';
import * as bLogger from 'bunyan';
import bStream from 'bunyan-debug-stream';

@Injectable({ scope: Scope.TRANSIENT })
export class MyLogger extends ConsoleLogger {
  private logger: bLogger;

  /** Setting for level */

  public constructor() {
    super();
    if (process.env.NODE_ENV === 'production') {
      this.logger = bLogger.createLogger({
        name: 'server',
      });
    } else {
      this.logger = bLogger.createLogger({
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
  }

  log(message: any) {
    this.logger.info(
      {
        time: new Date().toISOString(),
      },
      message,
    );
  }

  debug(message: any) {
    this.logger.debug(
      {
        time: new Date().toISOString(),
      },
      message,
    );
  }

  warn(message: any) {
    this.logger.warn(
      {
        time: new Date().toISOString(),
      },
      message,
    );
  }

  error(message: any) {
    this.logger.error(
      {
        time: new Date().toISOString(),
      },
      message,
    );
  }
}
