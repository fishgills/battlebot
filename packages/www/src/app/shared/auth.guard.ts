import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private service: AuthService) {}

  canActivate() {
    return this.service.isAuthenticated().pipe(
      map((response) => {
        if (response.userinfo.name) {
          return true;
        }
        this.router.navigate(['/login']);
        return false;
      }),
      catchError((err) => {
        this.router.navigate(['/home']);
        return of(false);
      }),
    );
  }
}
