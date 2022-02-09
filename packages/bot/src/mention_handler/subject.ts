import { SlackCommandMiddlewareArgs } from '@slack/bolt';
import { Subject } from '../common/Subject';

export class MentionSubject extends Subject<SlackCommandMiddlewareArgs> {}
