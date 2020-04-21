export class Tabla {
    lexema: string;
    tipo: string;
    fila: number;
    id: number;
    
    constructor(id:number, lexema:string, tipo: string, fila: number) {
        this.lexema = lexema;
        this.tipo = tipo;
        this.fila = fila;
        this.id = id;
    }
    
    public get getId() : number {
        return this.id;
    }

    public get getLexema() : string {
        return this.lexema;
    }

    public get getTipo() : string {
        return this.tipo;
    }
    
    public get getFila() : number {
        return this.fila;
    }
    
    toString() {
        return {
            "id" : this.id,
            "lexema" : this.lexema,
            "tipo" : this.tipo,
            "fila" : this.fila
        };
    }

}