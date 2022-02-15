import { AllMiddlewareArgs, SlackCommandMiddlewareArgs } from '@slack/bolt';
import { SheetObserver } from './character-sheet';
import { CombatObserver } from './combat';
import { CharacterCreateObserver } from './create-character';
import { HelpObserver } from './help';
import { MentionSubject } from './subject';

const sheetObserver = new SheetObserver('sheet');
const combatOberserver = new CombatObserver('fight');
const createCharacterObserver = new CharacterCreateObserver('create');
const helpObserver = new HelpObserver();

export const Command$ = new MentionSubject<
  SlackCommandMiddlewareArgs & AllMiddlewareArgs
>();

Command$.attach(sheetObserver);
Command$.attach(combatOberserver);
Command$.attach(createCharacterObserver);
Command$.attach(helpObserver);
