import { SectionBuilder } from 'slack-block-builder';
import { ObserveType } from '.';
import { sdk } from '../utils/gql';
import { editCharacterModal } from '../views/character';
import { ActionObserver } from './action-observer';

export class RerollObserver extends ActionObserver {
  getHelpBlocks(): SectionBuilder[] {
    throw new Error('Method not implemented.');
  }
  constructor() {
    super();
    this.command = 'reroll';
  }
  async update(event: ObserveType): Promise<void> {
    try {
      let char = (
        await sdk.characterByOwner({
          owner: event.body.user.id,
          teamId: event.context.teamId,
        })
      ).findByOwner;
      char = (
        await sdk.rollCharacter({
          id: char.id,
        })
      ).reroll;
      await event.respond({
        response_type: 'ephemeral',
        blocks: editCharacterModal(char),
      });
    } catch (e) {
      await event.respond(e.response.errors[0].message);
    }
  }
}
