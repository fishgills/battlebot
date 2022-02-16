import { SlackCommandMiddlewareArgs, AllMiddlewareArgs } from '@slack/bolt';
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
  async update(
    e: SlackCommandMiddlewareArgs & AllMiddlewareArgs,
  ): Promise<void> {
    if (
      !e.payload.text ||
      e.payload.text.trim().split(' ').length !== 2 ||
      e.payload.text.length > 100
    ) {
      this.msgUser(e, 'Invalid command. Should be `create MyCharacterName`');
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
        this.msgUser(e, `You already have a character.`);
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
      this.msgUser(e, `Character created!`);
    }
  }
}
