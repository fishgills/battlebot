import { Component } from '@angular/core';
import { PopupLoginService } from '../popup-login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(private service: PopupLoginService) {}

  login() {
    this.service.login().subscribe((value) => {
      console.log(value);
    });
  }
}
