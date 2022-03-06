import { Logger, LogLevel } from '@slack/web-api';
import Debug from 'debug';

const info = Debug('battlebot:info');
const debug = Debug('battlebot:debug');
const warn = Debug('battlebot:warn');
const error = Debug('battlebot:error');

export class BotLogger implements Logger {
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
    this.name = '';
  }

  public getLevel(): LogLevel {
    return this.level;
  }

  /**
   * Sets the instance's log level so that only messages which are equal or more severe are output to the console.
   */
  public setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * Set the instance's name, which will appear on each log line before the message.
   */
  public setName(name: string): void {
    this.name = name;
  }

  /**
   * Log a debug message
   */
  public debug(...msg: any[]): void {
    if (BotLogger.isMoreOrEqualSevere(LogLevel.DEBUG, this.level)) {
      debug(this.name, ...msg);
    }
  }

  /**
   * Log an info message
   */
  public info(...msg: any[]): void {
    if (BotLogger.isMoreOrEqualSevere(LogLevel.INFO, this.level)) {
      info(this.name, ...msg);
    }
  }

  /**
   * Log a warning message
   */
  public warn(...msg: any[]): void {
    if (BotLogger.isMoreOrEqualSevere(LogLevel.WARN, this.level)) {
      warn(this.name, ...msg);
    }
  }

  /**
   * Log an error message
   */
  public error(...msg: any[]): void {
    if (BotLogger.isMoreOrEqualSevere(LogLevel.ERROR, this.level)) {
      error(this.name, ...msg);
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

export { Debug, Logger };
