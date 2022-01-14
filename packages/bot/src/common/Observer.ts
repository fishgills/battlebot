import { ChatPostMessageResponse } from '@slack/web-api';
import { SlackBlockDto } from 'slack-block-builder';
import { Debug } from '../logger';

export abstract class Observer<T> {
  command: string;
  event: T;
  logger: Debug.Debugger;
  constructor(command: string) {
    this.command = command;
    this.logger = Debug(`battlebot:observer-${this.command}`);
    this.logger('created');
  }

  protected log(...msg: string[]) {
    this.logger(msg);
  }

  abstract msgUser(
    content: SlackBlockDto[] | string,
  ): Promise<ChatPostMessageResponse>;

  abstract msgThread(
    content: SlackBlockDto[] | string,
  ): Promise<ChatPostMessageResponse>;

  abstract update(): Promise<void>;

  abstract getHandleText(event: T): string;

  shouldHandle(event: T) {
    if (!this.command) {
      this.logger('Observer needs a command to observer');
    }
    const handleText = this.getHandleText(event);
    if (handleText === this.command) {
      this.logger(`accepting command: ${handleText}`);
      this.event = event;
      this.update();
    }
  }
}
