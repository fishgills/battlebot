import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface PopupResultUserClosed {
  userClosed: true;
}

export interface PopupResultReceivedUrl {
  userClosed: false;
  receivedUrl: string;
}

export type PopupResult = PopupResultUserClosed | PopupResultReceivedUrl;

export interface PopupOptions {
  width: number;
  height: number;
  left?: number;
  top?: number;
}

@Injectable({ providedIn: 'root' })
export class PopUpService {
  private STORAGE_IDENTIFIER = 'popupauth';
  private popUp: Window | null;
  private handle: number;
  private resultInternal$ = new Subject<PopupResult>();

  get result$(): Observable<PopupResult> {
    return this.resultInternal$.asObservable();
  }

  private get windowInternal(): Window {
    return this.document.defaultView as Window;
  }

  constructor(@Inject(DOCUMENT) private document: Document) {}

  isCurrentlyInPopup(): boolean {
    if (this.canAccessSessionStorage()) {
      const popup = sessionStorage.getItem(this.STORAGE_IDENTIFIER);

      return (
        !!this.windowInternal.opener &&
        this.windowInternal.opener !== this.windowInternal &&
        !!popup
      );
    }

    return false;
  }

  openPopUp(url: string, popupOptions?: PopupOptions): void {
    const optionsToPass = this.getOptions(popupOptions);
    this.popUp = this.windowInternal.open(
      url,
      '_blank',
      optionsToPass,
    ) as Window;

    this.popUp.sessionStorage.setItem(this.STORAGE_IDENTIFIER, 'true');

    const listener = (event: MessageEvent): void => {
      if (!event?.data || typeof event.data !== 'string') {
        return;
      }

      this.resultInternal$.next({ userClosed: false, receivedUrl: event.data });

      this.cleanUp(listener);
    };

    this.windowInternal.addEventListener('message', listener, false);

    this.handle = this.windowInternal.setInterval(() => {
      if (!this.popUp) {
        return;
      }
      if (this.popUp.closed) {
        this.resultInternal$.next({ userClosed: true });

        this.cleanUp(listener);
      }
    }, 200);
  }

  sendMessageToMainWindow(url: string): void {
    if (this.windowInternal.opener) {
      const href = this.windowInternal.location.href;

      this.sendMessage(url, href);
    }
  }

  private cleanUp(listener: any): void {
    this.windowInternal.removeEventListener('message', listener, false);

    this.windowInternal.clearInterval(this.handle);

    if (this.popUp) {
      this.popUp.sessionStorage?.removeItem(this.STORAGE_IDENTIFIER);
      this.popUp.close();
      this.popUp = null;
    }
  }

  private sendMessage(url: string, href: string): void {
    this.windowInternal.opener.postMessage(url, href);
  }

  private getOptions(popupOptions?: PopupOptions): string {
    const popupDefaultOptions: PopupOptions = {
      width: 650,
      height: 650,
      left: 50,
      top: 50,
    };

    const options: PopupOptions = {
      ...popupDefaultOptions,
      ...(popupOptions || {}),
    };
    const left: number =
      this.windowInternal.screenLeft +
      (this.windowInternal.outerWidth - options.width) / 2;
    const top: number =
      this.windowInternal.screenTop +
      (this.windowInternal.outerHeight - options.height) / 2;
    options.left = left;
    options.top = top;

    return Object.entries(options)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join(',');
  }

  private canAccessSessionStorage(): boolean {
    return (
      typeof navigator !== 'undefined' &&
      navigator.cookieEnabled &&
      typeof Storage !== 'undefined'
    );
  }
}
