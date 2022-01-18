import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      map((response: { authenticated: boolean }) => {
        if (response.authenticated) {
          return true;
        }
        this.router.navigate([`https://api.${environment.hostname}/login`]);
        return false;
      }),
      catchError((error) => {
        this.router.navigate([`https://api.${environment.hostname}/login`]);
        return of(false);
      }),
    );
  }
}
