import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PopUpService, PopupResultReceivedUrl } from './popup.service';

export interface LoginResponse {
  isAuthenticated: boolean;
  userData: any;
  accessToken: string;
  idToken: string;
  configId: string;
  errorMessage?: string;
}
@Injectable({
  providedIn: 'root',
})
export class PopupLoginService {
  constructor(
    private popupService: PopUpService,
    @Inject(DOCUMENT) private doc: any,
  ) {}

  login() {
    return of(`https://api.${environment.hostname}/login`).pipe(
      tap((url) => {
        return this.popupService.openPopUp(url);
      }),
      switchMap(() => {
        return this.popupService.result$.pipe(
          take(1),
          switchMap((result) => {
            if (result.userClosed) {
              return of({
                isAuthenticated: false,
                errorMessage: 'User closed popup',
              });
            } else {
              const { receivedUrl } = result;
              this.popupService.sendMessageToMainWindow(
                this.doc.defaultView?.location.toString(),
              );
              return of(null);
            }
          }),
        );
      }),
    );
  }
}
