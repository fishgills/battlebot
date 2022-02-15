import { SectionBuilder } from 'slack-block-builder';
import { CharacterType, UpdateCharacterInput } from '../generated/graphql';
import { sdk } from '../utils/gql';
import { editCharacterModal } from '../views/character';
import { ActionObserver } from './action-observer';

export class StatsObserver extends ActionObserver {
  async update(): Promise<void> {
    const { findByOwner } = await sdk.characterByOwner({
      owner: this.event.body.user.id,
      teamId: this.event.context.teamId,
    });

    if (findByOwner.extraPoints <= 0) {
      this.msgUser('You have no points to distribute.');
      return;
    }

    findByOwner[this.event.action.value] += 1;
    await sdk.CharacterUpdate({
      characterUpdateId: findByOwner.id,
      input: {
        defense: findByOwner.defense,
        strength: findByOwner.strength,
        vitality: findByOwner.vitality,
        extraPoints: findByOwner.extraPoints - 1,
      },
    });
    await this.msgUser(editCharacterModal(findByOwner));
  }
  getHelpBlocks(): void | readonly SectionBuilder[] {
    throw new Error('Method not implemented.');
  }
}
