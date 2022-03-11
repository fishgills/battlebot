import { Logger, LogLevel } from '@slack/web-api';
import tracer from 'dd-trace';
import * as bLogger from 'bunyan';
import formats from 'dd-trace/ext/formats';
import bStream from 'bunyan-debug-stream';

export class BotLogger implements Logger {
  private log: bLogger;

  /** Setting for level */
  private level: LogLevel;

  public constructor() {
    if (process.env.NODE_ENV === 'production') {
      this.log = bLogger.createLogger({
        name: 'bot',
      });
    } else {
      this.log = bLogger.createLogger({
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

  private injectDDTrace(...entry: any[]) {
    const span = tracer.scope().active();
    if (span) {
      tracer.inject(span.context(), formats.LOG, entry);
    }
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
    this.injectDDTrace(msg);
    msg.forEach((record) => this.log.debug(record));
  }

  /**
   * Log an info message
   */
  public info(...msg: any[]): void {
    this.injectDDTrace(msg);
    msg.forEach((record) => this.log.info(record));
  }

  /**
   * Log a warning message
   */
  public warn(...msg: any[]): void {
    this.injectDDTrace(msg);
    msg.forEach((record) => this.log.warn(record));
  }

  /**
   * Log an error message
   */
  public error(...msg: any[]): void {
    this.injectDDTrace(msg);
    msg.forEach((record) => this.log.error(record));
  }
}
const Logger = new BotLogger();

export { Logger };
