import { SlackCommandMiddlewareArgs, AllMiddlewareArgs } from '@slack/bolt';
import { Blocks, Message, SectionBuilder } from 'slack-block-builder';
import { t } from '../locale';
import { MentionObserver } from './observer';

export class HelpObserver extends MentionObserver {
  private blocks: SectionBuilder[] = [];

  public addBlocks(blocks: SectionBuilder[]) {
    this.blocks.push(...blocks);
  }
  async update(
    e: SlackCommandMiddlewareArgs & AllMiddlewareArgs,
  ): Promise<void> {
    const helpBlocks = Message()
      .blocks(
        Blocks.Section({
          text: t('help_no_command'),
        }),
        this.blocks,
      )
      .getBlocks();

    this.msgUser(e, helpBlocks);
    return;
  }
}
