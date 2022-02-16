import { AllMiddlewareArgs, SlackEventMiddlewareArgs } from '@slack/bolt';
import { Subject } from 'rxjs';
// import { ShieldObserver } from './shield-observer';
// import { EmojiSubject } from './subject';

export const Shield$ = new Subject<
  SlackEventMiddlewareArgs<'message'> & AllMiddlewareArgs
>();
// const shieldObserver = new ShieldObserver(':shield:');
// Shield$.attach(shieldObserver);
