import { SlackCommandMiddlewareArgs, AllMiddlewareArgs } from '@slack/bolt';
import { Blocks, Message, SectionBuilder } from 'slack-block-builder';
import { MentionObserver } from './observer';
import t from '../i18n';

export type BlockFn = (e: AllMiddlewareArgs) => SectionBuilder[];
export class HelpObserver extends MentionObserver {
  getHelpBlocks(): SectionBuilder[] {
    throw new Error('Method not implemented.');
  }
  private blockFns: BlockFn[] = [];

  public addBlocks(cb: BlockFn) {
    this.blockFns.push(cb);
  }

  async update(
    e: SlackCommandMiddlewareArgs & AllMiddlewareArgs,
  ): Promise<void> {
    const blocks = this.blockFns.map((fn) => {
      return fn(e);
    });
    const helpBlocks = Message()
      .blocks(
        Blocks.Section({
          text: t.t('common:help_no_command'),
        }),
        ...blocks,
      )
      .buildToObject();

    this.msgUser(e, helpBlocks);
    return;
  }
}
