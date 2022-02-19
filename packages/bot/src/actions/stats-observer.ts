import { ObserveType } from '.';
import { t } from '../locale';
import { sdk } from '../utils/gql';
import { editCharacterModal } from '../views/character';
import { ActionObserver } from './action-observer';

export class StatsObserver extends ActionObserver {
  constructor() {
    super();
    this.command = 'stat-incr';
  }
  async update(event: ObserveType): Promise<void> {
    const { findByOwner } = await sdk.characterByOwner({
      owner: event.body.user.id,
      teamId: event.context.teamId,
    });

    if (findByOwner.extraPoints <= 0) {
      this.msgUser(event, t('no_points'));
      return;
    }

    findByOwner[event.action.value] += 1;
    await sdk.CharacterUpdate({
      characterUpdateId: findByOwner.id,
      input: {
        defense: findByOwner.defense,
        strength: findByOwner.strength,
        vitality: findByOwner.vitality,
        extraPoints: findByOwner.extraPoints - 1,
      },
    });
    await this.msgUser(event, editCharacterModal(findByOwner));
  }
}
