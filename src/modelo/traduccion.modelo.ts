export class Traduccion {
    lexema: string;
    descripcion: string;

    constructor(lexema: string, descripcion: string) {
        this.lexema = lexema;
        this.descripcion = descripcion;
    }
    
    public get getLexema() : string {
        return this.lexema;
    }

    public get getDescripcion() : string {
        return this.descripcion;
    }
    
    toString(){
        return this.lexema;
    }
}
