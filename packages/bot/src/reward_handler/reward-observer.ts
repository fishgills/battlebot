import { AllMiddlewareArgs, SlackEventMiddlewareArgs } from '@slack/bolt';
import { Blocks } from 'slack-block-builder';
import { Observer } from '../common/AbstractObserver';
import { t } from '../locale';
import { sdk } from '../utils/gql';
import { getUsernames, isGenericMessageEvent } from '../utils/helpers';

export class RewardObserver<
  T extends SlackEventMiddlewareArgs<'app_mention'> & AllMiddlewareArgs,
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
  async msgUser(e: T, content: string): Promise<any> {
    return await e.say(content);
  }
  msgThread() {
    throw new Error('Method not implemented.');
  }
  listener(e: T): Promise<void> {
    return this.update(e);
  }
  async update(e: T): Promise<void> {
    if (!e.payload.text.includes(t('reward_emoji'))) {
      return;
    }

    const users = getUsernames(e.payload.text).filter(
      (user) => user.id !== e.context.botUserId,
    );
    if (!users || !users.length) {
      return;
    }

    const givenRewards = (
      await sdk.rewardsGivenToday({
        teamId: e.context.teamId,
        user: e.payload.user,
      })
    ).rewardsGivenToday;

    const diff = 10 - givenRewards;
    if (users.length > diff) {
      await this.msgUser(e, t('reward_left', users.length, diff));
      return;
    }
    await this.msgUser(
      e,
      t('reward_given', givenRewards + users.length, diff - users.length),
    );

    for (const user of users) {
      await sdk.giveReward({
        tid: e.context.teamId,
        from: e.payload.user,
        to: user.id,
      });
    }
  }

  getHandleText(): string {
    return t('reward_emoji'); // We use the Slack Bolt API already to filter. Always matches
  }
}
