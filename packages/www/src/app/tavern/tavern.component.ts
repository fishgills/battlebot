import { Component, OnInit } from '@angular/core';
import { InstallService } from '../slack';

@Component({
  selector: 'app-tavern',
  templateUrl: './tavern.component.html',
  styleUrls: ['./tavern.component.css'],
})
export class TavernComponent implements OnInit {
  constructor(public installService: InstallService) {}
  ngOnInit(): void {
    // this.installService.teamData$.subscribe((value) => console.log(value));
  }
}
