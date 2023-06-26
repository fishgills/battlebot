import { SectionBuilder } from 'slack-block-builder';
import { ObserveType } from '.';
import { t } from '../locale';
import { editCharacterModal } from '../views/character';
import { ActionObserver } from './action-observer';
import api from '../utils/api';

export class StatsObserver extends ActionObserver {
  getHelpBlocks(): SectionBuilder[] {
    throw new Error('Method not implemented.');
  }
  constructor() {
    super();
    this.command = 'stat-incr';
  }
  async update(event: ObserveType): Promise<void> {
    const { data: findByOwner } =
      await api.characters.charactersControllerFindByOwner(
        event.body.user.id,
        event.context.teamId,
      );

    if (findByOwner.extraPoints <= 0) {
      this.msgUser(event, t('no_points'));
      return;
    }

    findByOwner[event.action.value] += 1;
    await api.characters.charactersControllerUpdate(findByOwner.id, {
      defense: findByOwner.defense,
      strength: findByOwner.strength,
      vitality: findByOwner.vitality,
      extraPoints: findByOwner.extraPoints - 1,
    });

    await this.msgUser(event, editCharacterModal(findByOwner));
  }
}
