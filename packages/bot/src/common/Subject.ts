import { Observer } from './Observer';

export abstract class Subject<Event> {
  public observers: Observer<Event>[] = [];

  attach(observer: Observer<Event>): void {
    observer.setSubject(this);
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
