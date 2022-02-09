import { AllMiddlewareArgs, SlackEventMiddlewareArgs } from '@slack/bolt';
import { ChatPostMessageResponse } from '@slack/web-api';
import { Observer } from '../common/Observer';
import { sdk } from '../utils/gql';
import { getUsernames, isGenericMessageEvent } from '../utils/helpers';

export class ShieldObserver extends Observer<
  SlackEventMiddlewareArgs<'message'> & AllMiddlewareArgs
> {
  getHelpBlocks() {
    return;
  }
  msgUser(content: string) {
    if (!isGenericMessageEvent(this.event.message)) return;
    return this.event.client.chat.postMessage({
      text: content,
      channel: this.event.message.user,
      token: this.event.context.botToken,
      icon_emoji: ':shield:',
    });
  }
  msgThread(): Promise<ChatPostMessageResponse> {
    throw new Error('Method not implemented.');
  }
  async update(): Promise<void> {
    if (!isGenericMessageEvent(this.event.message)) return;

    const users = getUsernames(this.event.message.text);
    if (!users || !users.length) {
      return;
    }

    const givenRewards = (
      await sdk.rewardsGivenToday({
        user: this.event.message.user,
      })
    ).rewardsGivenToday;

    const diff = 10 - givenRewards;
    if (users) {
      if (users.length > diff) {
        this.msgUser(
          `You are trying to give away ${users.length} shields, but you only have ${diff} shields left today!`,
        );
        return;
      }
    }

    for (const user of users) {
      await sdk.giveReward({
        from: this.event.message.user,
        to: user.id,
      });
    }
  }

  getHandleText(): string {
    return ':shield:'; // We use the Slack Bolt API already to filter. Always matches
  }
}
