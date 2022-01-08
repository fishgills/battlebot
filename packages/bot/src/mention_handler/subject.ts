import { Subject } from '../common/Subject';
import { MentionSlackEvent } from '../common/types';

export class MentionSubject extends Subject<MentionSlackEvent> {}
