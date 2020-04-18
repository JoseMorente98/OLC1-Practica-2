import { Token } from 'src/modelo/token.modelo';

export class TokenControlador {
    private arregloToken: Token[] = [];
    private arregloError: Token[] = [];
    private idToken:number = 1;
    private idError:number = 1;

    //SINGLETON
    private static instancia: TokenControlador;

    private constructor() { }

    public static getInstancia(): TokenControlador {
        if (this.instancia == null) {
            this.instancia = new TokenControlador();
        }
        return this.instancia;
    }

    public get getArregloToken() : Token[] {
        return this.arregloToken; 
    }
    
    public get getArregloError() : Token[] {
        return this.arregloError; 
    }

    agregarToken(lexema: string, descripcion:string, fila: number, columna:number){
        var token = new Token(this.idToken, lexema, descripcion, fila, columna);
        this.arregloToken.push(token);
        this.idToken++;
    }

    agregarError(lexema: string, descripcion:string, fila: number, columna:number){
        var token = new Token(this.idError, lexema, descripcion, fila, columna);
        this.arregloError.push(token);
        this.idError++;
    }

    imprimirToken(){
        this.arregloToken.forEach(e => {
            console.log(e.toString());
        });
    }

    imprimirError(){
        this.arregloError.forEach(e => {
            console.error(e.toString());
        });
    }

    clear(){
        this.arregloToken = [];
        this.arregloError = [];
        this.idError = 1;
        this.idToken = 1;
    }

}