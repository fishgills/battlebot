import { SlackCommandMiddlewareArgs, AllMiddlewareArgs } from '@slack/bolt';
import { Blocks } from 'slack-block-builder';
import { t } from '../locale';
import { sdk } from '../utils/gql';
import { MentionObserver } from './observer';

export class CharacterCreateObserver extends MentionObserver {
  constructor() {
    super('create');
  }
  getHelpBlocks() {
    return [
      Blocks.Section({
        text: t('create_help_description'),
      }),
      Blocks.Section({
        text: t('create_help_command', t('command')),
      }),
    ];
  }
  async update(
    e: SlackCommandMiddlewareArgs & AllMiddlewareArgs,
  ): Promise<void> {
    if (
      !e.payload.text ||
      e.payload.text.trim().split(' ').length !== 2 ||
      e.payload.text.length > 100
    ) {
      this.msgUser(e, t('create_update_invalid'));
      return;
    }
    try {
      const char = (
        await sdk.characterByOwner({
          owner: e.payload.user_id,
          teamId: e.payload.team_id,
        })
      ).findByOwner;
      if (char.id) {
        this.msgUser(e, t('create_update_already_have_char'));
        return;
      }
    } catch (e) {
      await sdk.addCharacter({
        input: {
          owner: e.payload.user_id,
          name: e.payload.text.trim().split(' ')[1],
          teamId: e.payload.team_id,
        },
      });
      this.msgUser(e, t('create_update_char_created'));
    }
  }
}
