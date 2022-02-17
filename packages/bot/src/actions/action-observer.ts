import { ObserveType } from '.';
import { BaseObserver } from '../common/BaseObserver';

export abstract class ActionObserver extends BaseObserver<ObserveType> {
  getHandleText(event: ObserveType): string {
    return event.action.action_id;
  }
}
