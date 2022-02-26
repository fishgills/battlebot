import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InstallService } from '../slack';

@Component({
  selector: 'app-tavern',
  templateUrl: './tavern.component.html',
  styleUrls: ['./tavern.component.css'],
})
export class TavernComponent implements OnInit {
  public environment = environment;
  constructor(public installService: InstallService) {}
  ngOnInit(): void {
    // this.installService.teamData$.subscribe((value) => console.log(value));
  }

  openStripePortal() {
    window.location.href = `https://api.${environment.hostname}/stripe/create-portal`;
  }
}
