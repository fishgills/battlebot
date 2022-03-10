import { ObserveType } from '.';
import { CharacterType } from '../generated/graphql';
import { sdk } from '../utils/gql';
import { editCharacterModal } from '../views/character';
import { ActionObserver } from './action-observer';

export class DoneObserver extends ActionObserver {
  constructor() {
    super();
    this.command = 'complete';
  }
  async update(event: ObserveType): Promise<void> {
    const { findByOwner } = await sdk.characterByOwner({
      owner: event.body.user.id,
      teamId: event.context.teamId,
      withCombats: false,
    });

    if (findByOwner.active) {
      return;
    }

    findByOwner.active = true;
    await sdk.CharacterUpdate({
      input: {
        active: true,
      },
      characterUpdateId: findByOwner.id,
    });
    await this.msgUser(event, editCharacterModal(findByOwner as CharacterType));
  }
}
