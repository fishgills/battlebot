import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isAuthenticated$ = new ReplaySubject();
  constructor(private http: HttpClient) {}
  public isAuthenticated() {
    return this.http
      .get<{ authenticated: boolean }>(
        `https://api.${environment.hostname}/user`,
      )
      .pipe(
        tap((value) => {
          this.isAuthenticated$.next(value);
        }),
      );
  }
}
