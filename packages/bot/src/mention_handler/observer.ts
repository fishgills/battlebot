import { ChatPostMessageResponse } from '@slack/web-api';
import { SlackBlockDto } from 'slack-block-builder';
import { Observer } from '../common/Observer';
import { MentionSlackEvent } from '../common/types';

export abstract class MentionObserver extends Observer<MentionSlackEvent> {
  getHandleText(event: MentionSlackEvent): string {
    return event.payload.text.split(' ')[1];
  }
  async msgUser(
    content: string | SlackBlockDto[]
  ): Promise<ChatPostMessageResponse> {
    return await this.event.client.chat.postMessage({
      channel: this.event.payload.user,
      token: this.event.context.botToken,
      ...(Array.isArray(content) && { blocks: content }),
      ...(!Array.isArray(content) && { text: content })
    });
  }

  async msgThread(content: SlackBlockDto[] | string) {
    return this.event.client.chat.postMessage({
      thread_ts: this.event.event.thread_ts,
      channel: this.event.event.channel,
      ...(Array.isArray(content) && { blocks: content }),
      ...(!Array.isArray(content) && { text: content })
    });
  }
}
