import {
  AllMiddlewareArgs,
  SlackCommandMiddlewareArgs,
  SlackEventMiddlewareArgs,
} from '@slack/bolt';
import { Blocks, SectionBuilder } from 'slack-block-builder';
import { Observer } from '../common/AbstractObserver';
import { t } from '../locale';
import { getUsernames } from '../utils/helpers';
import api from '../utils/api';
import { BaseObserver } from '../common/BaseObserver';
import { ObserveType } from '../actions';

// export abstract class MentionObserver extends BaseObserver<ObserveType> {
//   getHandleText(event: ObserveType): string {
//     const text = normalizeQuotes(event.payload.text);
//     const match = text.match(/^(\w+) *(.*)$/);
//     return match ? match[1] : undefined;
//   }
//   public static getHelpBlocks<T extends MentionObserver>(
//     this: new (blah: any) => T,
//     blah: any,
//   ): T {
//     const self = new this(blah);
//     return self;
//   }
// }

export class RewardObserver<
  T extends SlackEventMiddlewareArgs & AllMiddlewareArgs,
> extends BaseObserver<T> {
  // export class RewardObserver<
  //   T extends SlackEventMiddlewareArgs<'app_mention'> & AllMiddlewareArgs,
  // > extends Observer<T> {
  getHelpBlocks(e: T): SectionBuilder[] {
    return [
      Blocks.Section({
        text: t('reward_help_description'),
      }),
      Blocks.Section({
        text: t('reward_help_example', t('reward_emoji'), e.context.botUserId),
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

    this.log(`Giving rewards to ${users.map((user) => user.id).join(',')}`);
    const res = await api.reward.rewardControllerRewardsGivenToday(
      e.payload.user,
      e.context.teamId,
    );
    const givenRewards = res.data;
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
      const res = await api.reward.rewardControllerGiveReward({
        destination: user.id,
        teamId: e.context.teamId,
        source: e.payload.user,
      });
    }
  }

  getHandleText(): string {
    return t('reward_emoji'); // We use the Slack Bolt API already to filter. Always matches
  }
}
