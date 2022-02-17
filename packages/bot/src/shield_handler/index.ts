import { AllMiddlewareArgs, SlackEventMiddlewareArgs } from '@slack/bolt';
import { Subject } from 'rxjs';
import { ShieldObserver } from './shield-observer';

export const Shield$ = new Subject<
  SlackEventMiddlewareArgs<'message'> & AllMiddlewareArgs
>();
const shieldObserver = new ShieldObserver();
Shield$.subscribe((e) => shieldObserver.listener(e));
