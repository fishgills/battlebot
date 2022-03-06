import { ChatPostMessageResponse } from '@slack/web-api';
import { SlackBlockDto } from 'slack-block-builder';
import { Debug } from '../logger';

export abstract class Observer<T> {
  command: string;
  logger: Debug.Debugger;

  constructor(command?: string) {
    this.command = command;
    this.logger = Debug(`battlebot:observer-${this.command}`);
    this.logger('created');
  }

  protected log(...msg: string[]) {
    this.logger(msg);
  }

  abstract msgUser(
    event: T,
    content: SlackBlockDto[] | string,
  ): Promise<ChatPostMessageResponse>;

  abstract listener(e: T): Promise<void>;

  abstract update(e: T): Promise<void>;
}
