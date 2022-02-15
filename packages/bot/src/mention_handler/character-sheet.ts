import { Blocks } from 'slack-block-builder';
import { sdk } from '../utils/gql';
import { editCharacterModal } from '../views/character';
import { MentionObserver } from './observer';

export class SheetObserver extends MentionObserver {
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
  async update(): Promise<void> {
    this.log(`requested character sheet`);
    try {
      const char = (
        await sdk.characterByOwner({
          owner: this.event.payload.user_id,
          teamId: this.event.payload.team_id,
        })
      ).findByOwner;
      await this.msgUser(editCharacterModal(char));
    } catch (e) {
      this.log(`character not found`);
      await this.msgUser(
        `You have no character. \`create <name>\` to make one.`,
      );
    }
  }
}
