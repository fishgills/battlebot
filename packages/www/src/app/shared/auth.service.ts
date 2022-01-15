import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SlackAuth } from './slack-auth.type';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  public isAuthenticated() {
    return this.http.get<SlackAuth>(
      `https://api.${environment.hostname}/user`,
      {
        withCredentials: true,
      },
    );
  }
}
