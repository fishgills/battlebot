import { AllMiddlewareArgs, SlackEventMiddlewareArgs } from '@slack/bolt';
import { Blocks } from 'slack-block-builder';
import { Observer } from '../common/AbstractObserver';
import { t } from '../locale';
import { sdk } from '../utils/gql';
import { getUsernames, isGenericMessageEvent } from '../utils/helpers';

export class RewardObserver<
  T extends SlackEventMiddlewareArgs<'message'> & AllMiddlewareArgs,
> extends Observer<T> {
  getHelpBlocks() {
    return [
      Blocks.Section({
        text: t('reward_help_description'),
      }),
      Blocks.Section({
        text: t('reward_help_example', t('reward_emoji')),
      }),
    ];
  }
  msgUser(e, content: string): Promise<any> {
    if (!isGenericMessageEvent(e.message)) return;

    return e.client.chat.postEphemeral({
      text: content,
      user: e.message.user,
      channel: e.payload.channel,
      // channel: e.message.user,
      // token: e.context.botToken,
      // icon_emoji: ':loudspeaker:',
    });
  }
  msgThread() {
    throw new Error('Method not implemented.');
  }
  listener(e: T): Promise<void> {
    return this.update(e);
  }
  async update(e: T): Promise<void> {
    if (!isGenericMessageEvent(e.message)) return;

    const users = getUsernames(e.message.text);
    if (!users || !users.length) {
      return;
    }

    const givenRewards = (
      await sdk.rewardsGivenToday({
        teamId: e.context.teamId,
        user: e.message.user,
      })
    ).rewardsGivenToday;

    const diff = 10 - givenRewards;
    if (users) {
      if (users.length > diff) {
        this.msgUser(e, t('reward_left', users.length, diff));
        return;
      } else {
        this.msgUser(e, t('reward_given', givenRewards + 1, diff - 1));
      }
    }

    for (const user of users) {
      await sdk.giveReward({
        tid: e.context.teamId,
        from: e.message.user,
        to: user.id,
      });
    }
  }

  getHandleText(): string {
    return t('reward_emoji'); // We use the Slack Bolt API already to filter. Always matches
  }
}
