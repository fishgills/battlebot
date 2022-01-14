import { AllMiddlewareArgs, SlackEventMiddlewareArgs } from '@slack/bolt';
import { ChatPostMessageResponse } from '@slack/web-api';
import { Observer } from '../common/Observer';
import { sdk } from '../utils/gql';
import { isGenericMessageEvent } from '../utils/helpers';

export class ShieldObserver extends Observer<
  SlackEventMiddlewareArgs<'message'> & AllMiddlewareArgs
> {
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

    const users = this.getUsernames(this.event.message.text);
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
        to: user,
      });
    }
  }

  private getUsernames(text: string): string[] {
    const rawUsers = text.match(new RegExp(/(<@[A-Z0-9]{2,}>)/g));
    if (!rawUsers) return [];
    const users = rawUsers.map((u) => u.replace('<@', '').replace('>', ''));
    const unique_users: string[] = users.filter(
      (value, i, arr) => arr.indexOf(value) === i,
    );
    return unique_users.length ? unique_users : [];
  }

  getHandleText(): string {
    return ':shield:'; // We use the Slack Bolt API already to filter. Always matches
  }
}
