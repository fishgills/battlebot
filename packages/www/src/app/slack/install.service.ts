import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { InstallGQL, SlackInstallModel } from 'src/generated/graphql';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class InstallService {
  public teamData$ = new ReplaySubject<SlackInstallModel>();
  private teamData: SlackInstallModel;
  constructor(
    private installService: InstallGQL,
    private authService: AuthService,
  ) {
    this.authService.isAuthenticated$
      .pipe(
        mergeMap((value) =>
          this.installService.fetch({
            teamId: value['https://slack.com/team_id'],
          }),
        ),
      )
      .subscribe((value) => {
        this.teamData = value.data.install;
        this.teamData$.next(this.teamData);
      });
    // ).subscribe((value) => {
    //   this.teamId = value['https://slack.com/team_id'];
    // });
  }
  public getTeam() {
    // return this.installService.fetch({
    //   teamId: this.teamId
    // }).pipe()
    // return this.http
    //   .get<Userinfo>(`https://api.${environment.hostname}/user`, {
    //     withCredentials: true,
    //   })
    //   .pipe(
    //     tap((value) => {
    //       this.isAuthenticated$.next(value);
    //     }),
    //   );
  }
}
