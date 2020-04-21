export class TablaSimbolo {
    id:number;
    identificador: string;
    tipo: string;
    ambito: string;
    fila: number;
    
    constructor(id:number, identificador:string, tipo: string, ambito: string, fila: number) {
        this.id = id;
        this.identificador = identificador;
        this.tipo = tipo;
        this.ambito = ambito;
        this.fila = fila;
    }

    public get getId() : number {
        return this.id;
    }

    public get getIdentificador() : string {
        return this.identificador;
    }

    public get getTipo() : string {
        return this.tipo;
    }
    
    public get getAmbito() : string {
        return this.ambito;
    }
    
    public get getFila() : number {
        return this.fila;
    }
    
    toString() {
        return {
            "id" : this.id,
            "identificador" : this.identificador,
            "tipo" : this.tipo,
            "fila" : this.fila,
            "ambito" : this.ambito
        };
    }

}