import { SectionBuilder } from 'slack-block-builder';
import { ObserveType } from '.';
import { editCharacterModal } from '../views/character';
import { ActionObserver } from './action-observer';
import api from '../utils/api';

export class DoneObserver extends ActionObserver {
  getHelpBlocks(): SectionBuilder[] {
    throw new Error('Method not implemented.');
  }
  constructor() {
    super();
    this.command = 'complete';
  }
  async update(event: ObserveType): Promise<void> {
    const { data } = await api.characters.charactersControllerFindByOwner(
      event.body.user.id,
      event.context.teamId,
    );

    if (data.active) {
      return;
    }

    data.active = true;
    await api.characters.charactersControllerUpdate(data.id, {
      active: true,
    });

    await this.msgUser(event, editCharacterModal(data));
  }
}
