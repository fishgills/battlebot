import { SlackCommandMiddlewareArgs, AllMiddlewareArgs } from '@slack/bolt';
import { Blocks, Message, SectionBuilder } from 'slack-block-builder';
import { MentionObserver } from './observer';

export class HelpObserver extends MentionObserver {
  private blocks: SectionBuilder[] = [];

  public addBlocks(blocks: SectionBuilder[]) {
    this.blocks.push(...blocks);
  }
  getHelpBlocks() {
    return;
  }
  async update(
    e: SlackCommandMiddlewareArgs & AllMiddlewareArgs,
  ): Promise<void> {
    const helpBlocks = Message()
      .blocks(
        Blocks.Section({
          text: 'No command received. :cry:',
        }),
        this.blocks,
      )
      .getBlocks();

    this.msgUser(e, helpBlocks);
    return;
  }
}
