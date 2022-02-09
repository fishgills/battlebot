import { Blocks } from 'slack-block-builder';
import { sdk } from '../utils/gql';
import { MentionObserver } from './observer';

export class CharacterCreateObserver extends MentionObserver {
  getHelpBlocks() {
    return [
      Blocks.Section({
        text: 'To create a character.',
      }),
      Blocks.Section({
        text: '`/battlebot create <CharacterName>`',
      }),
    ];
  }
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
          owner: this.event.payload.user_id,
          teamId: this.event.payload.team_id,
        })
      ).findByOwner;
      if (char.id) {
        this.msgUser(`You already have a character.`);
        return;
      }
    } catch (e) {
      await sdk.addCharacter({
        input: {
          owner: this.event.payload.user_id,
          name: this.event.payload.text.trim().split(' ')[2],
          teamId: this.event.payload.team_id,
        },
      });
      this.msgUser(`Character created!`);
    }
  }
}
