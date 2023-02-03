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
    return bLogger.createLogger({
      name: 'server',
      level: 'debug',
    });
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
