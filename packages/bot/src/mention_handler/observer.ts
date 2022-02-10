import { AllMiddlewareArgs, SlackCommandMiddlewareArgs } from '@slack/bolt';
import { ChatPostMessageResponse } from '@slack/web-api';
import { SlackBlockDto } from 'slack-block-builder';
import { Observer } from '../common/Observer';

function normalizeQuotes(text) {
  return text
    .replace(/\u00AB/g, '"')
    .replace(/\u00BB/g, '"')
    .replace(/\u201C/g, '"')
    .replace(/\u201D/g, '"')
    .replace(/\u201E/g, '"')
    .replace(/\u201F/g, '"');
}
export abstract class MentionObserver extends Observer<
  SlackCommandMiddlewareArgs & AllMiddlewareArgs
> {
  getHandleText(event: SlackCommandMiddlewareArgs): string {
    const text = normalizeQuotes(event.payload.text);
    const match = text.match(/^(\w+) *(.*)$/);
    return match ? match[1] : undefined;
  }
  async msgUser(
    content: string | SlackBlockDto[],
  ): Promise<ChatPostMessageResponse> {
    return await this.event.respond({
      response_type: 'ephemeral',

      ...(Array.isArray(content) && { blocks: content }),
      ...(!Array.isArray(content) && { text: content }),
    });
  }

  msgThread(
    content: string | SlackBlockDto[],
  ): Promise<ChatPostMessageResponse> {
    throw new Error('Method not implemented.');
  }
}
