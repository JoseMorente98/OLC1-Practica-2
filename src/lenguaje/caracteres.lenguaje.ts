export class CaracteresLenguaje {
    //SINGLETON
    private static instancia: CaracteresLenguaje;
    private auxiliar: string = "";
    private Puntuacion = ['{', '}', '[', ']', '(', ')', '?', '!', '&', '.', ',', ':', ';', '*', '/', '"', '-', "'"];
    private Simbolo = ['<', '>', '+', '|', '='];

    public static getInstancia(): CaracteresLenguaje {
        if (this.instancia == null) {
            this.instancia = new CaracteresLenguaje();
        }
        return this.instancia;
    }

    esLetra(entrada: string): boolean {
        var caracter = entrada.toLowerCase(); 
        return (caracter>='a' && caracter<='z');
    }

    esDigito(entrada:any): boolean {
        var charCodeZero = "0".charCodeAt(0);
        var charCodeNine = "9".charCodeAt(0);
        return (entrada.charCodeAt(0) >= charCodeZero && entrada.charCodeAt(0) <= charCodeNine);
    }

    esPuntuacion(entrada:string) : boolean {
        if ( this.Puntuacion.includes(entrada) ) {
            return true;
        }    
        return false;
    }

    esSimbolo(entrada:string) : boolean {
        if ( this.Simbolo.includes(entrada) ) {
            return true;
        }    
        return false;
    }
}