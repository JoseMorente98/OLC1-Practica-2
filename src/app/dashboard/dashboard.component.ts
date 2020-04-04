import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  tabs:any = []
  seletedItem:string;

  constructor() {
    this.tabs[0] = "1";
    this.tabs[1] = "2";
    this.tabs[2] = "3";
    this.tabs[3] = "4";
    console.log(this.tabs)
  }

  ngOnInit(): void {
  }

}
