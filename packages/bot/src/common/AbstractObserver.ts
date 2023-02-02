import { SectionBuilder, SlackMessageDto } from 'slack-block-builder';
import { Logger } from '../logger';

export abstract class Observer<T> {
  command: string;
  private logger: typeof Logger;

  constructor(command?: string) {
    this.command = command;
    this.logger = Logger;
    this.logger.info(`created ${command} observer`);
  }

  protected log(msg: string) {
    this.logger.debug(msg);
  }

  abstract msgUser(event: T, content: SlackMessageDto | string): Promise<any>;

  abstract listener(e: T): Promise<void>;

  abstract update(e: T): Promise<void>;
  abstract getHelpBlocks(): SectionBuilder[];
}
