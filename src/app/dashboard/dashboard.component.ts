import { Component, OnInit } from '@angular/core';
import { AnalizadorLexico } from 'src/analizador/lexico.analizador';
import { TokenControlador } from 'src/controlador/token.controlador';
import { AnalizadorSintactico } from 'src/analizador/sintactico.analizador';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  tabs:any = []
  noTabs:number = 0;
  seletedItem:string;
  sintacticoAnalizer: any;

  constructor() {
    this.tabs[this.noTabs] = this.noTabs +1;
    this.noTabs++;
    this.tabs[this.noTabs] = this.noTabs+1;
    this.noTabs++;
    this.tabs[this.noTabs] = this.noTabs+1;
    console.log(this.tabs)
    this.sintacticoAnalizer = AnalizadorSintactico.getInstancia();
  }

  ngOnInit(): void {
  }

  obtenerTexto( entradaTexto: string ){
    console.clear();
    console.log(entradaTexto);

    /**
     * LIMPIAR VARIABLES
     */
    TokenControlador.getInstancia().clear();

    /**
     * ANALISIS LEXICO
     */
    AnalizadorLexico.getInstancia().scanner(entradaTexto);
    TokenControlador.getInstancia().imprimirToken();
    
    /**
     * ANALISIS SINTACTICO
     */
    AnalizadorSintactico.getInstancia().scanner(TokenControlador.getInstancia().getArregloToken);
  }

  public agregarTabs() {
    this.noTabs++;
    this.tabs[this.noTabs] = this.noTabs+1;
  }


}
