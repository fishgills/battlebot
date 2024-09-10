import { AllMiddlewareArgs, SlackCommandMiddlewareArgs } from '@slack/bolt';
import { Subject } from 'rxjs';
import { BaseObserver } from '../common/BaseObserver';
import { RewardObserver } from '../reward_handler/reward-observer';
import { CharacterCreateObserver } from './create-character';
import { CharacterDeleteObserver } from './delete-character';
import { HelpObserver } from './help';
import { StringIndexed } from '@slack/bolt/dist/types/helpers';
export const Command$ = new Subject<
  SlackCommandMiddlewareArgs & AllMiddlewareArgs<StringIndexed>
>();

type IObservers =
  // | SheetObserver
  // | CombatObserver
  CharacterCreateObserver | CharacterDeleteObserver;
// | RewardObserver;

const helpObserver = new HelpObserver();

const Observers: IObservers[] = [
  // SheetObserver,
  // CombatObserver,
  CharacterCreateObserver,
  CharacterDeleteObserver,
  // RewardObserver,
];

Observers.forEach((t) => {
  const obs = new t();
  helpObserver.addBlocks(obs.getHelpBlocks);
  if (obs instanceof BaseObserver) Command$.subscribe((e) => obs.listener(e));
});

Command$.subscribe((e) => helpObserver.listener(e));
