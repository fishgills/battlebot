import { ObserveType } from '.';
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
    });

    if (findByOwner.active) {
      return;
    }

    await sdk.CharacterUpdate({
      input: {
        active: true,
      },
      characterUpdateId: findByOwner.id,
    });
    await this.msgUser(event, editCharacterModal(findByOwner));
  }
}
