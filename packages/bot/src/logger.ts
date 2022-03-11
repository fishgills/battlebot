import { Logger, LogLevel } from '@slack/web-api';
// import pino, { HttpLogger } from 'pino-http';
import { pino, Logger as pLogger } from 'pino';
export class BotLogger implements Logger {
  private log: pLogger;

  /** Setting for level */
  private level: LogLevel;

  /** Name */
  private name: string;

  /** Map of severity as comparable numbers for each log level */
  private static severity: { [key in LogLevel]: number } = {
    [LogLevel.ERROR]: 400,
    [LogLevel.WARN]: 300,
    [LogLevel.INFO]: 200,
    [LogLevel.DEBUG]: 100,
  };

  public constructor() {
    this.level = LogLevel.INFO;

    this.log = pino({
      transport:
        process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty' }
          : undefined,
    });
  }

  public getLevel(): LogLevel {
    return this.level;
  }

  /**
   * Sets the instance's log level so that only messages which are equal or more severe are output to the console.
   */
  public setLevel(level: LogLevel): void {
    this.level = level;
    this.log.level = level;
  }

  /**
   * Set the instance's name, which will appear on each log line before the message.
   */
  public setName(name: string): void {
    alert(name);
  }

  /**
   * Log a debug message
   */
  public debug(...msg: any[]): void {
    if (BotLogger.isMoreOrEqualSevere(LogLevel.DEBUG, this.level)) {
      this.log.debug(msg);
    }
  }

  /**
   * Log an info message
   */
  public info(...msg: any[]): void {
    if (BotLogger.isMoreOrEqualSevere(LogLevel.INFO, this.level)) {
      this.log.info(msg);
    }
  }

  /**
   * Log a warning message
   */
  public warn(...msg: any[]): void {
    if (BotLogger.isMoreOrEqualSevere(LogLevel.WARN, this.level)) {
      this.log.warn(msg);
    }
  }

  /**
   * Log an error message
   */
  public error(...msg: any[]): void {
    if (BotLogger.isMoreOrEqualSevere(LogLevel.ERROR, this.level)) {
      this.log.error(msg);
    }
  }

  /**
   * Helper to compare two log levels and determine if a is equal or more severe than b
   */
  private static isMoreOrEqualSevere(a: LogLevel, b: LogLevel): boolean {
    return BotLogger.severity[a] >= BotLogger.severity[b];
  }
}
const Logger = new BotLogger();

export { Logger };
