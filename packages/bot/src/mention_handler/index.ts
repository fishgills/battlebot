import { AllMiddlewareArgs, SlackCommandMiddlewareArgs } from '@slack/bolt';
import { Subject } from 'rxjs';
import { SheetObserver } from './character-sheet';
import { CombatObserver } from './combat';
import { CharacterCreateObserver } from './create-character';
import { HelpObserver } from './help';
export const Command$ = new Subject<
  SlackCommandMiddlewareArgs & AllMiddlewareArgs
>();

const helpObserver = new HelpObserver();

[SheetObserver, CombatObserver, CharacterCreateObserver].forEach((t) => {
  const obs = new t();
  helpObserver.addBlocks(obs.getHelpBlocks());
  Command$.subscribe((e) => obs.listener(e));
});

Command$.subscribe((e) => helpObserver.listener(e));
