import {
  AllMiddlewareArgs,
  SlackActionMiddlewareArgs,
  SlackCommandMiddlewareArgs,
} from '@slack/bolt';
import { SlackMessageDto, SlackBlockDto } from 'slack-block-builder';
import { Observer } from './AbstractObserver';

type base = AllMiddlewareArgs &
  (SlackActionMiddlewareArgs | SlackCommandMiddlewareArgs);

export abstract class BaseObserver<R extends base> extends Observer<R> {
  abstract getHandleText(event: base): string | undefined;

  async msgUser(event: R, content: SlackMessageDto | string) {
    return await event.respond({
      response_type: 'ephemeral',
      text: typeof content === 'string' ? content : content.text,
      ...(typeof content !== 'string' && { blocks: content.blocks }),
    });
  }
  listener(e: R): Promise<void> {
    const command = this.getHandleText(e);
    if (command === this.command) {
      return this.update(e);
    }
    return Promise.resolve();
  }
}
