import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { PopupLoginService } from './popup-login.service';
import { PopUpService } from './popup.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private popupService: PopUpService,
    private login: PopupLoginService,
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      map((response) => {
        if (response.ok) {
          return true;
        }
        return false;
        // return this.login.login().pipe(switchMap(() => of(false)));
      }),
      catchError(() => {
        return this.login.login().pipe(
          tap((resp) => {
            if (resp?.errorMessage !== 'User closed popup')
              this.router.navigate(['/tavern']);
          }),
          switchMap(() => of(false)),
        );
      }),
    );
  }
}
