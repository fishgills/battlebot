import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
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

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      map((response) => {
        if (response.id_token) {
          return true;
        }
        return false;
        // return this.login.login().pipe(switchMap(() => of(false)));
      }),
      catchError((error) => {
        return this.login.login().pipe(switchMap(() => of(false)));
      }),
    );
  }
}
