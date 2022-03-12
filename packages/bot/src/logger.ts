import { Logger, LogLevel } from '@slack/web-api';
import tracer from 'dd-trace';
import * as bLogger from 'bunyan';
import bStream from 'bunyan-debug-stream';
import { format } from 'date-fns';

export class BotLogger implements Logger {
  private log: bLogger;

  /** Setting for level */
  private level: LogLevel;

  public constructor() {
    if (process.env.NODE_ENV === 'production') {
      this.log = bLogger.createLogger({
        name: 'bot',
        level: 'debug',
      });
    } else {
      this.log = bLogger.createLogger({
        name: 'bot-dev',
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
            path: '/tmp/bot.log',
            level: 'info',
          },
        ],
      });
    }
  }

  public getLevel(): LogLevel {
    return this.level;
  }

  private injectDDTrace(record: any) {
    const span = tracer.scope().active();
    if (span) {
      tracer.inject(span.context(), 'log', record);
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private record(record: any): [{ time: string }, any] {
    this.injectDDTrace(record);
    return [
      {
        time: format(new Date(), 'dd/LLL/yyyy:H:m:s XX'),
      },
      record,
    ];
  }

  /**
   * Sets the instance's log level so that only messages which are equal or more severe are output to the console.
   */
  public setLevel(level: LogLevel): void {
    this.log.level(level);
  }

  /**
   * Set the instance's name, which will appear on each log line before the message.
   */
  public setName(name: string): void {
    throw new Error(name);
  }

  /**
   * Log a debug message
   */
  public debug(...msg: any[]): void {
    msg.forEach((record) => this.log.debug(...this.record(record)));
  }

  /**
   * Log an info message
   */
  public info(...msg: any[]): void {
    msg.forEach((record) => this.log.info(...this.record(record)));
  }

  /**
   * Log a warning message
   */
  public warn(...msg: any[]): void {
    msg.forEach((record) => this.log.warn(...this.record(record)));
  }

  /**
   * Log an error message
   */
  public error(...msg: any[]): void {
    msg.forEach((record) => this.log.error(...this.record(record)));
  }
}
const Logger = new BotLogger();

export { Logger };
