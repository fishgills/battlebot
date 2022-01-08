import { WebClient } from '@slack/web-api';
import { Observer } from './Observer';

export abstract class Subject<Event> {
  private observers: Observer<Event>[] = [];
  private client: WebClient;

  attach(observer: Observer<Event>): void {
    this.observers.push(observer);
  }

  notify(event: Event): void {
    for (const observer of this.observers) {
      observer.shouldHandle(event);
    }
  }
  event(slackEvent: Event) {
    this.notify(slackEvent);
  }
}
