import { AllMiddlewareArgs, SlackCommandMiddlewareArgs } from '@slack/bolt';
import { BaseObserver } from '../common/BaseObserver';

type ObserveType = SlackCommandMiddlewareArgs & AllMiddlewareArgs;

function normalizeQuotes(text) {
  return text
    .replace(/\u00AB/g, '"')
    .replace(/\u00BB/g, '"')
    .replace(/\u201C/g, '"')
    .replace(/\u201D/g, '"')
    .replace(/\u201E/g, '"')
    .replace(/\u201F/g, '"');
}
export abstract class MentionObserver extends BaseObserver<ObserveType> {
  getHandleText(event: ObserveType): string {
    const text = normalizeQuotes(event.payload.text);
    const match = text.match(/^(\w+) *(.*)$/);
    return match ? match[1] : undefined;
  }
}
