import {
  AllMiddlewareArgs,
  BlockButtonAction,
  SlackActionMiddlewareArgs,
} from '@slack/bolt';
import { ChatPostMessageResponse } from '@slack/web-api';
import { SlackBlockDto } from 'slack-block-builder';
import { Observer } from '../common/Observer';

type ObserveType = SlackActionMiddlewareArgs<BlockButtonAction> &
  AllMiddlewareArgs;

export abstract class ActionObserver extends Observer<ObserveType> {
  getHandleText(event: ObserveType): string {
    return event.action.action_id;
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
