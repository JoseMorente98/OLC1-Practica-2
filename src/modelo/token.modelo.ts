export class Token {
    id: number;
    lexema: string;
    descripcion: string;
    fila: number;
    columna: number;

    constructor(id:number, lexema:string, descripcion:string, fila:number, columna:number) {
        this.id = id;
        this.lexema = lexema;
        this.descripcion = descripcion;
        this.fila = fila;
        this.columna = columna;
    }
    
    public get getId() : number {
        return this.id;
    }

    public set setId(v : number) {
        this.id = v;
    }
    
    public get getDescripcion() : string {
        return this.descripcion;
    }
    
    public set setDescripcion(v : string) {
        this.descripcion = v;
    }
    
    public get getLexema() : string {
        return this.lexema;
    }

    public set setLexema(v : string) {
        this.lexema = v;
    }
    
    public get getFila() : number {
        return this.fila;
    }
    
    public set setFila(v : number) {
        this.fila = v;
    }
    
    public get getColumna() : number {
        return this.columna;
    }

    public set setColumna(v : number) {
        this.columna = v;
    }

    toString() {
        return {
            "id" : this.id,
            "lexema" : this.lexema,
            "descripcion" : this.descripcion,
            "fila" : this.fila,
            "columna" : this.columna
        };
    }

}