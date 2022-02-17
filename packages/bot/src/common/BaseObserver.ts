import {
  AllMiddlewareArgs,
  SlackActionMiddlewareArgs,
  SlackCommandMiddlewareArgs,
} from '@slack/bolt';
import { ChatPostMessageResponse } from '@slack/web-api';
import { SlackBlockDto } from 'slack-block-builder';
import { Observer } from './AbstractObserver';

type base = (SlackActionMiddlewareArgs | SlackCommandMiddlewareArgs) &
  AllMiddlewareArgs;

export abstract class BaseObserver<R extends base> extends Observer<R> {
  abstract getHandleText(event: base): string;

  async msgUser(
    event: R,
    content: string | SlackBlockDto[],
  ): Promise<ChatPostMessageResponse> {
    return await event.respond({
      response_type: 'ephemeral',

      ...(Array.isArray(content) && { blocks: content }),
      ...(!Array.isArray(content) && { text: content }),
    });
  }
  listener(e: R): Promise<void> {
    const command = this.getHandleText(e);
    if (command === this.command) {
      return this.update(e);
    }
  }
}
