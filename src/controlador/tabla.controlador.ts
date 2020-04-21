import { TablaSimbolo } from 'src/modelo/tabla.modelo';

export class TablaControlador {
    //SINGLETON
    private static instacia: TablaControlador;
    //VARIABLES
    private arregloTabla: TablaSimbolo[] = [];
    private idTabla:number = 1;

    private constructor() { }

    public static getInstancia(): TablaControlador {
        if (this.instacia == null) {
            this.instacia = new TablaControlador();
        }
        return this.instacia;
    }

    /**
     * AGREGAR A LA TABLA DE SIMBOLOS
     */
    public agregar(identificador: string, tipo:string, ambito: string, fila: number){
        var tabla = new TablaSimbolo(this.idTabla, identificador, tipo, ambito, fila);
        this.arregloTabla.push(tabla);
        this.idTabla++;
    }

    /**
     * BUSCAR TABLA DE SIMBOLOS
     */
    public buscar(id: string, ambito?: string) : boolean {
        for (let i = 0; i < this.arregloTabla.length; i++) {
            const e = this.arregloTabla[i];
            if(e.getIdentificador == id && e.getAmbito == ambito ){
                return true;
            }   
        }
        return false;
    }

    /**
     * OBTENER TABLA DE SIMBOLOS
     */
    public get getArregloTabla() : TablaSimbolo[] {
        return this.arregloTabla;
    }

    clear(){
        this.arregloTabla = [];
        this.idTabla = 1;
    }  

}