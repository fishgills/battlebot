import { AllMiddlewareArgs, SlackCommandMiddlewareArgs } from '@slack/bolt';
import { Subject } from 'rxjs';
import { SheetObserver } from './character-sheet';
import { CombatObserver } from './combat';
import { CharacterCreateObserver } from './create-character';
import { HelpObserver } from './help';

const sheetObserver = new SheetObserver('sheet');
const combatOberserver = new CombatObserver('fight');
const createCharacterObserver = new CharacterCreateObserver('create');
const helpObserver = new HelpObserver();

export const Command$ = new Subject<
  SlackCommandMiddlewareArgs & AllMiddlewareArgs
>();

Command$.subscribe((e) => sheetObserver.listener(e));
Command$.subscribe((e) => combatOberserver.listener(e));
Command$.subscribe((e) => createCharacterObserver.listener(e));
Command$.subscribe((e) => helpObserver.listener(e));
