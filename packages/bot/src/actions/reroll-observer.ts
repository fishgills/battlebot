import { ObserveType } from '.';
import { CharacterType } from '../generated/graphql';
import { sdk } from '../utils/gql';
import { editCharacterModal } from '../views/character';
import { ActionObserver } from './action-observer';

export class RerollObserver extends ActionObserver {
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
          withCombats: false,
        })
      ).findByOwner;
      char = (
        await sdk.rollCharacter({
          id: char.id,
        })
      ).reroll;
      await event.respond({
        response_type: 'ephemeral',
        blocks: editCharacterModal(char as CharacterType),
      });
    } catch (e) {
      await event.respond(e.response.errors[0].message);
    }
  }
}
