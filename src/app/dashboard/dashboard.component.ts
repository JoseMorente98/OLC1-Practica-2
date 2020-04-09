import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  tabs:any = []
  noTabs:number = 0;
  seletedItem:string;

  constructor() {
    this.tabs[this.noTabs] = this.noTabs +1;
    this.noTabs++;
    this.tabs[this.noTabs] = this.noTabs+1;
    this.noTabs++;
    this.tabs[this.noTabs] = this.noTabs+1;
    console.log(this.tabs)
  }

  ngOnInit(): void {
  }

  obtenerTexto( strEntrada: string ){
    console.clear();
    console.log(strEntrada);

  }

  public agregarTabs() {
    this.noTabs++;
    this.tabs[this.noTabs] = this.noTabs+1;
  }


}
