import { AllMiddlewareArgs, SlackEventMiddlewareArgs } from '@slack/bolt';
import { ChatPostMessageResponse } from '@slack/web-api';
import { Observer } from '../common/AbstractObserver';
import { sdk } from '../utils/gql';
import { getUsernames, isGenericMessageEvent } from '../utils/helpers';

export class ShieldObserver extends Observer<
  SlackEventMiddlewareArgs<'message'> & AllMiddlewareArgs
> {
  msgUser(
    e: SlackEventMiddlewareArgs<'message'> & AllMiddlewareArgs,
    content: string,
  ): Promise<ChatPostMessageResponse> {
    if (!isGenericMessageEvent(e.message)) return;
    return e.client.chat.postMessage({
      text: content,
      channel: e.message.user,
      token: e.context.botToken,
      icon_emoji: ':shield:',
    });
  }
  msgThread(): Promise<ChatPostMessageResponse> {
    throw new Error('Method not implemented.');
  }
  listener(
    e: SlackEventMiddlewareArgs<'message'> & AllMiddlewareArgs,
  ): Promise<void> {
    return this.update(e);
  }
  async update(
    e: SlackEventMiddlewareArgs<'message'> & AllMiddlewareArgs,
  ): Promise<void> {
    if (!isGenericMessageEvent(e.message)) return;

    const users = getUsernames(e.message.text);
    if (!users || !users.length) {
      return;
    }

    const givenRewards = (
      await sdk.rewardsGivenToday({
        user: e.message.user,
      })
    ).rewardsGivenToday;

    const diff = 10 - givenRewards;
    if (users) {
      if (users.length > diff) {
        this.msgUser(
          e,
          `You are trying to give away ${users.length} shields, but you only have ${diff} shields left today!`,
        );
        return;
      }
    }

    for (const user of users) {
      await sdk.giveReward({
        from: e.message.user,
        to: user.id,
      });
    }
  }

  getHandleText(): string {
    return ':shield:'; // We use the Slack Bolt API already to filter. Always matches
  }
}
