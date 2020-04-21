import { Component, OnInit } from '@angular/core';
import { AnalizadorLexico } from 'src/analizador/lexico.analizador';
import { TokenControlador } from 'src/controlador/token.controlador';
import { AnalizadorSintactico } from 'src/analizador/sintactico.analizador';
import { Traductor } from 'src/traductor/traductor.traductor';
import { TablaControlador } from 'src/controlador/tabla.controlador';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  p: number = 1;
  tabs:any = []
  noTabs:number = 0;
  seletedItem:string;
  file:any;
  arregloSimbolos:any[] = [];

  constructor() {
    this.tabs[this.noTabs] = this.noTabs +1;
    this.noTabs++;
    this.tabs[this.noTabs] = this.noTabs+1;
    this.noTabs++;
    this.tabs[this.noTabs] = this.noTabs+1;
  }

  ngOnInit(): void {
  }

  cargarArchivo(e:any) {
    this.file = e.target.files[0];
  }

  cargarDocumento(id: number) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      var i = "editorTexto" + id;
      const textArea = document.getElementById(i);
      textArea.textContent = fileReader.result.toString();
    }
    fileReader.readAsText(this.file);
  }

  obtenerTexto( entradaTexto: string ){
    console.clear();
    Traductor.getInstancia().clear();

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

    /**
     * TRADUCTOR
     */
    Traductor.getInstancia().scanner(TokenControlador.getInstancia().getArregloToken);

    /**
     * CONSOLA
     */
    let textAreaConsola = document.getElementById("textAreaConsola");
    textAreaConsola.textContent = "";
    textAreaConsola.textContent = Traductor.getInstancia().ObtenerErrores();

    /**
     * CONSOLA TRADUCCION
     */
    let textArea = document.getElementById("textAreaTraduccion");
    textArea.textContent = "";
    textArea.textContent = Traductor.getInstancia().verTraduccion(); 

    /**
     * HTML
     */
    let textAreaHtml = document.getElementById("textAreaHTML");
    textAreaHtml.textContent = "";
    textAreaHtml.textContent = Traductor.getInstancia().verHTML();
    
    /**
     * JSON
     */
    let textAreaJson = document.getElementById("textAreaJSON");
    textAreaJson.textContent = "";
    textAreaJson.textContent = Traductor.getInstancia().verJSON();

    /**
     * MOSTRAR TABLA DE SIMBOLOS
     */
    this.arregloSimbolos = [];
    this.arregloSimbolos = TablaControlador.getInstancia().getArregloTabla;
  }

  public agregarTabs() {
    this.noTabs++;
    this.tabs[this.noTabs] = this.noTabs+1;
  }

}
