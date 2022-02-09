import { SheetObserver } from './character-sheet';
import { CombatObserver } from './combat';
import { CharacterCreateObserver } from './create-character';
import { HelpObserver } from './help';
import { MentionSubject } from './subject';

export const Mention$ = new MentionSubject();
const sheetObserver = new SheetObserver('sheet');
const combatOberserver = new CombatObserver('fight');
const createCharacterObserver = new CharacterCreateObserver('create');
const helpObserver = new HelpObserver();
Mention$.attach(sheetObserver);
Mention$.attach(combatOberserver);
Mention$.attach(createCharacterObserver);
Mention$.attach(helpObserver);
