import { SectionBuilder, SlackMessageDto } from 'slack-block-builder';
import { Logger } from '../logger';

export abstract class Observer<T> {
  command = '';
  private logger: typeof Logger;

  constructor(command?: string) {
    if (command) this.command = command;
    this.logger = Logger;
    this.logger.info(`created ${command} observer`);
  }

  protected debug(msg: string) {
    this.logger.debug(msg);
  }

  protected log(msg: string) {
    this.logger.info(msg);
  }

  abstract msgUser(event: T, content: SlackMessageDto | string): Promise<any>;

  abstract listener(e: T): Promise<void>;

  abstract update(e: T): Promise<void>;
  abstract getHelpBlocks(e: T): SectionBuilder[];
}
