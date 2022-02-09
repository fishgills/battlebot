import { sdk } from '../utils/gql';
import { editCharacterModal } from '../views/character';
import { MentionObserver } from './observer';

export class SheetObserver extends MentionObserver {
  async update(): Promise<void> {
    this.log(`requested character sheet`);
    try {
      const char = (
        await sdk.characterByOwner({
          owner: this.event.payload.user,
          teamId: this.event.context.teamId,
        })
      ).findByOwner;
      await this.msgUser(editCharacterModal(char));
    } catch (e) {
      this.log(`character not found`);
      await this.msgThread(
        `<@${this.event.payload.user}>, You have no character. \`create <name>\` to make one.`,
      );
    }
  }
}
