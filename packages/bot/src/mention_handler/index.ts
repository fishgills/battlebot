import { AllMiddlewareArgs, SlackCommandMiddlewareArgs } from '@slack/bolt';
import { Subject } from 'rxjs';
import { BaseObserver } from '../common/BaseObserver';
import { RewardObserver } from '../reward_handler/reward-observer';
import { SheetObserver } from './character-sheet';
import { CombatObserver } from './combat';
import { CharacterCreateObserver } from './create-character';
import { CharacterDeleteObserver } from './delete-character';
import { HelpObserver } from './help';
export const Command$ = new Subject<
  SlackCommandMiddlewareArgs & AllMiddlewareArgs
>();

const helpObserver = new HelpObserver();

[
  SheetObserver,
  CombatObserver,
  CharacterCreateObserver,
  CharacterDeleteObserver,
  RewardObserver,
].forEach((t) => {
  const obs = new t();
  helpObserver.addBlocks(obs.getHelpBlocks());
  if (obs instanceof BaseObserver) Command$.subscribe((e) => obs.listener(e));
});

Command$.subscribe((e) => helpObserver.listener(e));
