import tracer from 'dd-trace';
import { Logger, LogLevel } from '@slack/bolt';
import { pino, Logger as pLogger } from 'pino';
import { env } from './env';

export class BotLogger implements Logger {
  private log: pLogger;
  /** Setting for level */
  private level: LogLevel;

  public constructor() {
    console.log('creating logger');

    this.level = env.isProduction ? LogLevel.INFO : LogLevel.DEBUG;

    this.log = pino({
      level: this.level,
    });
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
  private record(record: any) {
    this.injectDDTrace(record);
    return record;
  }

  /**
   * Sets the instance's log level so that only messages which are equal or more severe are output to the console.
   */
  public setLevel(level: LogLevel): void {
    return;
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
    msg.forEach((record) => this.log.debug(this.record(record)));
  }

  /**
   * Log an info message
   */
  public info(...msg: any[]): void {
    msg.forEach((record) => this.log.info(this.record(record)));
  }

  /**
   * Log a warning message
   */
  public warn(...msg: any[]): void {
    msg.forEach((record) => this.log.warn(record));
  }

  /**
   *
   * Log a verbose message
   *
   * @param msg Array of messages
   */
  public verbose(...msg: any[]): void {
    msg.forEach((record) => this.log.trace(record));
  }
  /**
   * Log an error message
   */
  public error(...msg: any[]): void {
    msg.forEach((record) => this.log.error(record));
  }
}
const Logger = new BotLogger();

export { Logger };
