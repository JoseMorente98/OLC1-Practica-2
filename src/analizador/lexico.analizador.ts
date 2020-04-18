import { CaracteresLenguaje } from 'src/lenguaje/caracteres.lenguaje';
import { TokenControlador } from 'src/controlador/token.controlador';

export class AnalizadorLexico {
    //SINGLETON
    private static instancia: AnalizadorLexico;
    private auxiliar: string = "";

    public static getInstancia(): AnalizadorLexico {
        if (this.instancia == null) {
            this.instancia = new AnalizadorLexico();
        }
        return this.instancia;
    }

    scanner(entradaTexto: string) {
        var estado: number = 0;
        var columna: number = 0;
        var fila: number = 1;

        for (let i = 0; i < entradaTexto.length; i++) {
            var letra = entradaTexto[i];
            columna++;
            switch (estado) {
                case 0:
                    /**
                     * ANALIZA LETRA 
                     */
                    if (CaracteresLenguaje.getInstancia().esLetra(letra)) {
                        estado = 1;
                        this.auxiliar += letra;
                    }
                    /**
                     * ANALIZA SALTO DE LINEA 
                     */
                    else if (letra == '\n') {
                        estado = 0;
                        columna = 0;
                        fila++;
                    }
                    /**
                     * ANALIZA ESPACIOS EN BLANCO 
                     */
                    else if (letra == ' ' || letra.charCodeAt(0) == 13) {
                        columna++;
                        estado = 0;
                    }
                    /**
                     * ANALIZA TABULACIONES 
                     */
                    else if (letra == '\t') {
                        estado = 0;
                        columna++;
                    }
                    /**
                     * ANALIZA DIGITOS 
                     */
                    else if (CaracteresLenguaje.getInstancia().esDigito(letra)) {
                        estado = 2;
                        this.auxiliar += letra;
                    }
                    /**
                     * ANALIZA PUNTUACIONES 
                     */
                    else if (CaracteresLenguaje.getInstancia().esPuntuacion(letra)) {
                        if (letra == "!") {
                            TokenControlador.getInstancia().agregarToken(letra.toString(), "S_Exclamacion", fila, columna - 1);
                        }
                        else if (letra == "&") {
                            TokenControlador.getInstancia().agregarToken(letra.toString(), "S_Ampersand", fila, columna - 1);
                        }
                        else if (letra == ".") {
                            TokenControlador.getInstancia().agregarToken(letra.toString(), "S_Punto", fila, columna - 1);
                        }
                        else if (letra == ",") {
                            TokenControlador.getInstancia().agregarToken(letra.toString(), "S_Coma", fila, columna - 1);
                        }
                        else if (letra == ":") {
                            TokenControlador.getInstancia().agregarToken(letra.toString(), "S_Dos_Puntos", fila, columna - 1);
                        }
                        else if (letra == ";") {
                            TokenControlador.getInstancia().agregarToken(letra.toString(), "S_Punto_Coma", fila, columna - 1);
                        }
                        else if (letra == "{") {
                            TokenControlador.getInstancia().agregarToken(letra.toString(), "S_Llave_Izquierda", fila, columna - 1);
                        }
                        else if (letra == "}") {
                            TokenControlador.getInstancia().agregarToken(letra.toString(), "S_Llave_Derecha", fila, columna - 1);
                        }
                        else if (letra == "[") {
                            TokenControlador.getInstancia().agregarToken(letra.toString(), "S_Corchete_Izquierda", fila, columna - 1);
                        }
                        else if (letra == "(") {
                            TokenControlador.getInstancia().agregarToken(letra.toString(), "S_Parentesis_Izquierda", fila, columna - 1);
                        }
                        else if (letra == ")") {
                            TokenControlador.getInstancia().agregarToken(letra.toString(), "S_Parentesis_Derecha", fila, columna - 1);
                        }
                        else if (letra == "]") {
                            TokenControlador.getInstancia().agregarToken(letra.toString(), "S_Corchete_Derecha", fila, columna - 1);
                        }
                        else if (letra == "?") {
                            TokenControlador.getInstancia().agregarToken(letra.toString(), "S_Interrogacion", fila, columna - 1);
                        }
                        else if (letra == "*") {
                            TokenControlador.getInstancia().agregarToken(letra.toString(), "S_Multiplicacion", fila, columna - 1);
                        }
                        else if (letra == "/") {
                            estado = 3;
                            this.auxiliar += letra;
                        }
                        else if (letra == '"') {
                            estado = 8;
                            this.auxiliar += letra;
                        }
                        else if (letra == "'") {
                            estado = 10;
                            this.auxiliar += letra;
                        }
                        else if (letra == "-") {
                            TokenControlador.getInstancia().agregarToken(letra.toString(), "S_Resta", fila, columna - 1);
                        }
                    }
                    /**
                     * ANALIZA SIMBOLOS 
                     */
                    else if(CaracteresLenguaje.getInstancia().esSimbolo(letra) ) {
                        if (letra == "<") {
                            TokenControlador.getInstancia().agregarToken(letra.toString(), "S_Menor", fila, columna - 1);
                        }
                        else if (letra == ">") {
                            TokenControlador.getInstancia().agregarToken(letra.toString(), "S_Mayor", fila, columna - 1);
                        } 
                        else if (letra == "+") {
                            TokenControlador.getInstancia().agregarToken(letra.toString(), "S_Suma", fila, columna - 1);
                        } 
                        else if (letra == '|') {
                            TokenControlador.getInstancia().agregarToken(letra.toString(), "S_Pleca", fila, columna - 1);
                        } 
                        else if (letra == '=') {
                            TokenControlador.getInstancia().agregarToken(letra.toString(), "S_Igual", fila, columna - 1);
                        } 
                        else if (letra == '_') {
                            TokenControlador.getInstancia().agregarToken(letra.toString(), "S_Guion_Bajo", fila, columna - 1);
                        }
                    }
                    else {
                        TokenControlador.getInstancia().agregarError(letra.toString(), "TK_Desconocido", fila, columna);
                        estado = 0;
                    }
                    break;
                case 1:
                    if (CaracteresLenguaje.getInstancia().esLetra(letra)
                        || CaracteresLenguaje.getInstancia().esDigito(letra)
                        || letra == '_') {
                        this.auxiliar += letra;
                        estado = 1;
                    }
                    else {
                        const reservada = ['int', 'string' ,'double', 'char', 'bool', 'public', 'class',
                        'static', 'void', 'main', 'return', 'true', 'false', 'for', 'if', 'while', 'else', 'const',
                        'switch', 'case', 'break', 'null', 'default', 'do', 'console', 'write', 'continue', 'abstract',
                        'writeline', 'continue', 'decimal', 'try', 'catch', 'float'];

                        if (reservada.includes(this.auxiliar.toLowerCase())) {
                            TokenControlador.getInstancia().agregarToken(this.auxiliar.toLowerCase(), "TK_" + this.auxiliar.toLowerCase(), fila, (columna - this.auxiliar.length - 1));
                        }
                        else {
                            TokenControlador.getInstancia().agregarToken(this.auxiliar, "TK_Identificador", fila, (columna - this.auxiliar.length - 1));
                        }
                        this.auxiliar = "";
                        estado = 0;
                        i--;
                        columna--;
                    }
                    break;
                case 2:
                    if (CaracteresLenguaje.getInstancia().esDigito(letra)) {
                        this.auxiliar += letra;
                        estado = 2;
                    } else if (letra == ".") {
                        this.auxiliar += letra;
                        estado = 12;
                    }   
                    else {
                        TokenControlador.getInstancia().agregarToken(this.auxiliar, "TK_Numero", fila, columna);
                        i--;
                        columna--; 
                        this.auxiliar = "";
                        estado = 0;
                    }
                    break;
                case 3:
                    if (letra == '/') {
                        estado = 4;
                        this.auxiliar += letra;
                    } else if (letra == '*') {
                        estado = 5;
                        i--;
                        columna--;
                    } else {
                        TokenControlador.getInstancia().agregarToken("/", "S_Division", fila, columna);
                        i--;
                        columna--;
                        estado = 0;    
                    }   
                    break;
                case 4:
                    if (letra != '\n') {
                        this.auxiliar += letra;
                        estado = 4;
                    }
                    else {
                        TokenControlador.getInstancia().agregarToken(this.auxiliar, "TK_Comentario_Linea", fila, 0);
                        fila++; columna = 0;
                        estado = 0;
                        this.auxiliar = "";
                    }
                    break;
                case 5:
                    if (letra == '*') {
                        estado = 6;
                        this.auxiliar += letra;
                    }
                    else {
                        this.auxiliar = "";
                        TokenControlador.getInstancia().agregarToken("/", "S_Division", fila, columna - 1);
                        estado = 0;
                        i--;
                    }
                    break;
                case 6:
                    if (letra != '*') {
                        if (letra == '\n'){ 
                            fila++; 
                            columna = 0; 
                        }
                        this.auxiliar += letra;
                        estado = 6;
                    }
                    else {
                        this.auxiliar += letra;
                        estado = 7;
                    }
                    break;
                case 7:
                    if (letra == '/') {
                        this.auxiliar += letra;
                        TokenControlador.getInstancia().agregarToken(this.auxiliar, "TK_Comentario_Multilinea", fila, columna);
                        estado = 0;
                        this.auxiliar = "";
                    } else{
                        this.auxiliar += letra;
                        estado = 6;
                    }  
                    break;
                case 8:
                    if (letra != '"') {
                        if (letra == '\n'){ 
                            fila++; 
                            columna = 0; 
                        }
                        this.auxiliar += letra;
                        estado = 8;
                    }
                    else {
                        estado = 9;
                        this.auxiliar += letra;
                        i--; columna--;
                    }
                    break;
                case 9:
                    if (letra == '"') {
                        TokenControlador.getInstancia().agregarToken(this.auxiliar, "TK_Cadena", fila, (columna - this.auxiliar.length));
                        estado = 0;
                        this.auxiliar = "";
                    }
                    break;
                case 10: 
                    if (letra != "'") {
                        if (letra == '\n') { fila++; columna = 0; }
                        this.auxiliar += letra;
                        estado = 10;
                    }
                    else {
                        estado = 11;
                        this.auxiliar += letra;
                        i--; columna--;
                    }
                    break;  
                case 11: 
                    if (letra == "'") {
                        estado = 0;
                        var strTemp = this.auxiliar.replace("'", " ").replace("'", " ").trim();
                        if((strTemp.length> 1)){
                            if (this.auxiliar.includes("<") && this.auxiliar.includes(">")) {
                                TokenControlador.getInstancia().agregarToken(this.auxiliar, "TK_HTML", fila, (columna - this.auxiliar.length));        
                            } else {
                                TokenControlador.getInstancia().agregarToken(this.auxiliar, "TK_Cadena", fila, (columna - this.auxiliar.length));
                            } 
                        } else {
                            TokenControlador.getInstancia().agregarToken(this.auxiliar, "TK_Caracter", fila, columna);
                        }
                        this.auxiliar = "";
                    }
                    break; 
                case 12:
                    if(CaracteresLenguaje.getInstancia().esDigito(letra)){
                        this.auxiliar += letra;
                        estado = 12;
                    } else {
                        TokenControlador.getInstancia().agregarToken(this.auxiliar, "TK_Decimal", fila, (columna - this.auxiliar.length));  
                        i--;
                        columna--; 
                        estado = 0;
                        this.auxiliar = "";
                    }  
                    break; 
                default:
                    TokenControlador.getInstancia().agregarToken(letra.toString(), "TK_Desconocido", fila, columna);
                    break;
            }
        }
    }



}