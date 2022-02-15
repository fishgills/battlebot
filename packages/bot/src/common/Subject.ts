import { Observer } from './Observer';

export abstract class Subject<T> {
  public observers: Observer<T>[] = [];

  attach(observer: Observer<T>): void {
    observer.setSubject(this);
    this.observers.push(observer);
  }

  notify(event: T): void {
    for (const observer of this.observers) {
      observer.shouldHandle(event);
    }
  }
  event(slackEvent: T) {
    this.notify(slackEvent);
  }
}
