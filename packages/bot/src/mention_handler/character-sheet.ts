import { AllMiddlewareArgs, SlackCommandMiddlewareArgs } from '@slack/bolt';
import { Blocks } from 'slack-block-builder';
import { CharacterType } from '../generated/graphql';
import { t } from '../locale';
import { sdk } from '../utils/gql';
import { editCharacterModal } from '../views/character';
import { MentionObserver } from './observer';

export class SheetObserver extends MentionObserver {
  constructor() {
    super('sheet');
  }
  getHelpBlocks() {
    return [
      Blocks.Section({
        text: t('sheet_help_description'),
      }),
      Blocks.Section({
        text: t('sheet_help_command', t('command')),
      }),
    ];
  }

  async update(
    event: SlackCommandMiddlewareArgs & AllMiddlewareArgs,
  ): Promise<void> {
    this.log(`requested character sheet`);
    try {
      const char = (
        await sdk.characterByOwner({
          owner: event.payload.user_id,
          teamId: event.payload.team_id,
          withCombats: false,
        })
      ).findByOwner as CharacterType;
      await this.msgUser(event, editCharacterModal(char));
    } catch (e) {
      this.log(`character not found`);
      await this.msgUser(event, t('sheet_no_character'));
    }
  }
}
