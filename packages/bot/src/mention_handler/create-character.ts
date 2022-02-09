import { Md } from 'slack-block-builder';
import { sdk } from '../utils/gql';
import { MentionObserver } from './observer';

export class CharacterCreateObserver extends MentionObserver {
  async update(): Promise<void> {
    if (
      !this.event.payload.text ||
      this.event.payload.text.trim().split(' ').length !== 3 ||
      this.event.payload.text.length > 100
    ) {
      this.msgUser('Invalid command. Should be `create MyCharacterName`');
      return;
    }
    try {
      const char = (
        await sdk.characterByOwner({
          owner: this.event.payload.user,
          teamId: this.event.context.teamId,
        })
      ).findByOwner;
      if (char.id) {
        const userMd = Md.user(this.event.context.botUserId);
        const quoteMd = Md.quote(`${userMd} sheet`);
        this.msgUser(
          `You already have a character. Use ${quoteMd} to review it.`,
        );
        return;
      }
    } catch (e) {
      await sdk.addCharacter({
        input: {
          owner: this.event.payload.user,
          name: this.event.payload.text.trim().split(' ')[2],
          teamId: this.event.context.teamId,
        },
      });
      const userMd = Md.user(this.event.context.botUserId);
      const quoteMd = Md.quote(`${userMd} sheet`);

      this.msgUser(`Character created! ${quoteMd} to review your character.`);
    }
  }
}
