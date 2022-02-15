import { Subject } from '../common/Subject';

export class ActionSubject<T> extends Subject<T> {
  public actions(): RegExp {
    const actions = ['reroll', 'stat-inc'];
    return new RegExp(actions.join('|'), 'gi');
  }
}
