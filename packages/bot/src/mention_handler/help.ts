import { SlackCommandMiddlewareArgs, AllMiddlewareArgs } from '@slack/bolt';
import { Blocks, Message } from 'slack-block-builder';
import { MentionObserver } from './observer';

export class HelpObserver extends MentionObserver {
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
        // this.subject.observers
        //   .map((value) => value.getHelpBlocks())
        //   .filter((i): i is SectionBuilder[] => {
        //     return typeof i !== 'undefined';
        //   })
        //   .flat(1),
      )
      .getBlocks();

    this.msgUser(e, helpBlocks);
    return;
  }
}
