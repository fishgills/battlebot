import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { PopupLoginService } from './popup-login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private service: PopupLoginService) {}
  ngOnInit(): void {
    this.service.checkAuth();
  }
}
