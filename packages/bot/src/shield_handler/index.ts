import { ShieldObserver } from './shield-observer';
import { EmojiSubject } from './subject';

export const Shield$ = new EmojiSubject();
const shieldObserver = new ShieldObserver(':shield:');
Shield$.attach(shieldObserver);
