import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  isAuthenticated = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe((value) => {
      console.log(value);
    });
  }
}
