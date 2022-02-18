import { AllMiddlewareArgs, SlackEventMiddlewareArgs } from '@slack/bolt';
import { Subject } from 'rxjs';
import { RewardObserver } from './reward-observer';

export const Shield$ = new Subject<
  SlackEventMiddlewareArgs<'message'> & AllMiddlewareArgs
>();
const shieldObserver = new RewardObserver();
Shield$.subscribe((e) => shieldObserver.listener(e));
