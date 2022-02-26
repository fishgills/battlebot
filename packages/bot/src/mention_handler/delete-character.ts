import { SlackCommandMiddlewareArgs, AllMiddlewareArgs } from '@slack/bolt';
import { Blocks } from 'slack-block-builder';
import { t } from '../locale';
import { MentionObserver } from './observer';

export class CharacterDeleteObserver extends MentionObserver {
  constructor() {
    super('delete');
  }
  getHelpBlocks() {
    return [
      Blocks.Section({
        text: t('delete_help_description'),
      }),
      Blocks.Section({
        text: t('delete_help_command', t('command')),
      }),
    ];
  }
  async update(
    e: SlackCommandMiddlewareArgs & AllMiddlewareArgs,
  ): Promise<void> {
    await this.msgUser(e, t('visit_web_site'));
    return;
  }
}
