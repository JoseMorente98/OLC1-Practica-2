export class CaracteresLenguaje {
    //SINGLETON
    private static instancia: CaracteresLenguaje;
    private auxiliar: string = "";
    private Puntuacion = ['{', '}', '[', ']', '(', ')', '?', '!', '&', '.', ',', ':', ';', '*', '/', '"', '-', "'"];
    private Simbolo = ['<', '>', '+', '|', '=', '_'];
    private Digitos = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

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
        if ( this.Digitos.includes(entrada) ) {
            return true;
        }    
        return false;
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