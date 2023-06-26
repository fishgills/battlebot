import { SectionBuilder } from 'slack-block-builder';
import { ObserveType } from '.';
import { editCharacterModal } from '../views/character';
import { ActionObserver } from './action-observer';
import api from '../utils/api';

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
        await api.characters.charactersControllerFindByOwner(
          event.body.user.id,
          event.context.teamId,
        )
      ).data;
      char = (await api.characters.charactersControllerReroll(char.id)).data;
      await event.respond({
        response_type: 'ephemeral',
        blocks: editCharacterModal(char).blocks,
      });
    } catch (e) {
      await event.respond(e.response.errors[0].message);
    }
  }
}
