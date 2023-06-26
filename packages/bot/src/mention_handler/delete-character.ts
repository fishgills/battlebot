import { SlackCommandMiddlewareArgs, AllMiddlewareArgs } from '@slack/bolt';
import { Blocks } from 'slack-block-builder';
import { t } from '../locale';
import { MentionObserver } from './observer';
import api from '../utils/api';

export class CharacterDeleteObserver extends MentionObserver {
  constructor() {
    super('fire');
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
    try {
      await api.characters.charactersControllerRemoveFromTeam({
        owner: e.payload.user_id,
        teamId: e.payload.team_id,
      });
    } catch (err) {
      this.debug(err);
    }
    // if (numDeleted > 0) {
    await this.msgUser(e, t('character_deleted'));
    // }
    // if (numDeleted === 0) {
    //   await this.msgUser(e, t('character_delete_no_character'));
    // }

    return;
  }
}
