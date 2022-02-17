import { AllMiddlewareArgs, SlackCommandMiddlewareArgs } from '@slack/bolt';
import { Blocks } from 'slack-block-builder';
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
        text: 'To retrieve your character sheet.',
      }),
      Blocks.Section({
        text: '`/battlebot sheet`',
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
        })
      ).findByOwner;
      await this.msgUser(event, editCharacterModal(char));
    } catch (e) {
      this.log(`character not found`);
      await this.msgUser(
        event,
        `You have no character. \`create <name>\` to make one.`,
      );
    }
  }
}
