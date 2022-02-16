import { AllMiddlewareArgs, SlackCommandMiddlewareArgs } from '@slack/bolt';
import { ChatPostMessageResponse } from '@slack/web-api';
import { SlackBlockDto } from 'slack-block-builder';
import { Observer } from '../common/Observer';

type ObserveType = SlackCommandMiddlewareArgs & AllMiddlewareArgs;

function normalizeQuotes(text) {
  return text
    .replace(/\u00AB/g, '"')
    .replace(/\u00BB/g, '"')
    .replace(/\u201C/g, '"')
    .replace(/\u201D/g, '"')
    .replace(/\u201E/g, '"')
    .replace(/\u201F/g, '"');
}
export abstract class MentionObserver extends Observer<ObserveType> {
  getHandleText(event: SlackCommandMiddlewareArgs): string {
    const text = normalizeQuotes(event.payload.text);
    const match = text.match(/^(\w+) *(.*)$/);
    return match ? match[1] : undefined;
  }

  async msgUser(
    event: ObserveType,
    content: string | SlackBlockDto[],
  ): Promise<ChatPostMessageResponse> {
    return await event.respond({
      response_type: 'ephemeral',

      ...(Array.isArray(content) && { blocks: content }),
      ...(!Array.isArray(content) && { text: content }),
    });
  }
  listener(e: ObserveType): Promise<void> {
    const command = this.getHandleText(e);
    if (command === this.command) {
      return this.update(e);
    }
  }
}
