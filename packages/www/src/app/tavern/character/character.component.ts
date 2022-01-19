import { Component, OnInit } from '@angular/core';

import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth.service';
import { CharacterByOwnerGQL, CharacterModel } from 'src/generated/graphql';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css'],
})
export class CharacterComponent implements OnInit {
  public character: CharacterModel;

  constructor(
    private authService: AuthService,
    private charService: CharacterByOwnerGQL,
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$
      .pipe(
        switchMap((value) => {
          return this.charService.watch({
            owner: value['https://slack.com/user_id'],
          }).valueChanges;
        }),
      )
      .subscribe((value) => {
        this.character = value.data.findByOwner;
      });
  }
}
