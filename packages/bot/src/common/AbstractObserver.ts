import { ChatPostMessageResponse } from '@slack/web-api';
import { SlackBlockDto } from 'slack-block-builder';
import { Logger } from 'tslog';

export abstract class Observer<T> {
  command: string;
  private logger: Logger;

  constructor(command?: string) {
    this.command = command;
    this.logger = new Logger({ name: `observer: ${this.command}` });
    this.logger.info('created');
  }

  protected log(...msg: string[]) {
    this.logger.debug(msg);
  }

  abstract msgUser(
    event: T,
    content: SlackBlockDto[] | string,
  ): Promise<ChatPostMessageResponse>;

  abstract listener(e: T): Promise<void>;

  abstract update(e: T): Promise<void>;
}
