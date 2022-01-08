import { AllMiddlewareArgs, SlackEventMiddlewareArgs } from '@slack/bolt';

export type MentionSlackEvent = SlackEventMiddlewareArgs<'app_mention'> &
  AllMiddlewareArgs;

export type MessageSlackEvent = SlackEventMiddlewareArgs<'message'> &
  AllMiddlewareArgs;

export type SupportedEvents = MentionSlackEvent | MessageSlackEvent;
