import { AllMiddlewareArgs, SlackEventMiddlewareArgs } from '@slack/bolt';
import { Subject } from '../common/Subject';

export class EmojiSubject extends Subject<
  SlackEventMiddlewareArgs<'message'> & AllMiddlewareArgs
> {}
