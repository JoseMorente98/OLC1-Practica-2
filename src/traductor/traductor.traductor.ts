import { Token } from 'src/modelo/token.modelo';
import { Traduccion } from 'src/modelo/traduccion.modelo';
import { TablaControlador } from 'src/controlador/tabla.controlador';


export class Traductor {
    //SINGLETON
    private static instancia: Traductor;
    /**
     * PROPIEDADES
     */
    private arregloToken: Token[] = [];
    private indiceActual:number = 0;
    private tokenActual:Token = null;
    private esMetodo:boolean = false;
    private esFuncion:boolean = false;
    private esSwitchRepeticion:number = 0;
    private esRepeticion:number = 0;
    /**
     * VARIABLES TRADUCCION
     */
    private traductor: string = "";
    private arrayTraducido: Traduccion[] = [];
    private elementosHTML: string[] = [];
    private elementosJSON: Traduccion[] = [];
    private tipoDeDatos = ['TK_void','TK_int', 'TK_double', 'TK_char', 'TK_bool', 'TK_string'];
    private salidaError = "";

    /**
     * TABLA DE VARIABLES
     */
    private tipo: string = "";
    private ambito: string = "";
    private tipoTemporal: string = "";
    private TK_Identificador: string = "";
    private fila: number = 0;

    constructor() {}

    public static getInstancia(): Traductor {
        if (this.instancia == null) {
            this.instancia = new Traductor();
        }
        return this.instancia;
    }

    scanner(arregloToken:Token[])
    {
        this.arregloToken = arregloToken;
        this.indiceActual = 0;
        this.tokenActual = arregloToken[this.indiceActual];
        this.inicio();
    }

    public inicio() {
        this.declaracionComentario();
        this.declaracionClase();
        this.declaracionComentario();
    }

     //CLASE Y METODO TKINCIPAL
    public declaracionClase() {
        if(this.tokenActual.getDescripcion == "TK_public") {
            this.match("TK_public");
            this.match("TK_class");
            this.ambito = "Global";
            this.traductor = "class " + this.tokenActual.getLexema + ":";
            this.agregarTraduccion(this.traductor, "TK_Cadena");
            this.agregarTraduccion("{", "S_Llave_Izquierda");
            this.match("TK_Identificador");
            this.match("S_Llave_Izquierda");
            this.declaracionComentario();
            this.declaracionGlobal();
            this.declaracionComentario();
            this.match("S_Llave_Derecha");
            this.agregarTraduccion("}", "S_Llave_Derecha");
            
        } else {
            this.match("TK_class");
            this.traductor = "class " + this.tokenActual.getLexema + ":";
            this.agregarTraduccion(this.traductor, "TK_Cadena");
            this.agregarTraduccion("{", "S_Llave_Izquierda");
            this.match("TK_Identificador");
            this.match("S_Llave_Izquierda");
            this.declaracionComentario();
            this.declaracionGlobal();
            this.declaracionComentario();
            this.match("S_Llave_Derecha");
            this.agregarTraduccion("}", "S_Llave_Derecha");
        }
    }

    public declaracionGlobal() {
        this.declaracionComentario();
        this.declaracion();
        this.declaracionComentario();
        this.otraDeclaracionGlobal();
        this.declaracionComentario();
    }

    public declaracion(){
        if(this.tokenActual.getDescripcion!=null) {
            if(this.tokenActual.getDescripcion == 'TK_void') {
                this.match("TK_void");
                this.tipo = "Metodo Void";
                this.tokenActual = this.arregloToken[this.indiceActual];
                if(this.tokenActual.getDescripcion == 'TK_main') {
                    this.agregarVariable(this.tipo, "Main", this.tokenActual.getFila, "Global");
                    this.ambito = "Metodo Main";
                    this.traductor =  this.traductor + "def main ";
                    this.declaracionComentario();
                    this.metodoPrincipal();
                    this.declaracionComentario();
                } else if(this.tokenActual.getDescripcion == 'TK_Identificador') {
                    this.TK_Identificador = this.tokenActual.getLexema;
                    this.fila = this.tokenActual.getFila;
                    this.agregarVariable(this.tipo, this.TK_Identificador, this.fila, "Global");
                    this.ambito = "Metodo "+this.tokenActual.getLexema ;
                    this.metodoVoid();
                }
            } else if(this.tipoDeDatos.includes(this.tokenActual.getDescripcion)) { 
                this.declaracionComentario();
                this.tipoDeclaracion();
                this.declaracionComentario();
            }
        }
    }

    public tipoDeclaracion() {
        if(this.tipoDeDatos.includes(this.tokenActual.getDescripcion)) {
            this.tipo = this.tokenActual.getLexema;
            this.tipoTemporal = this.tokenActual.getLexema;
            this.match(this.tokenActual.getDescripcion);
            this.traductor = this.traductor + this.tokenActual.getLexema;
            this.TK_Identificador = this.tokenActual.getLexema;
            this.fila = this.tokenActual.getFila;
            this.match("TK_Identificador");
            this.asignacionVariableGlobal();
            this.tokenActual = this.arregloToken[this.indiceActual];
            if(this.tokenActual.getDescripcion == "S_Parentesis_Izquierda") {
                this.esFuncion = true;
                this.agregarVariable("Funcion " + this.tipo, this.TK_Identificador, this.fila, this.ambito);
                this.ambito = "Funcion " + this.traductor;
                this.traductor = "def " + this.traductor + "(";
                this.match("S_Parentesis_Izquierda");
                this.declaracionParametros();
                this.traductor = this.traductor+ "):";
                this.agregarTraduccion(this.traductor, "TK_Cadena");
                this.agregarTraduccion("{", "S_Llave_Izquierda");
                this.match("S_Parentesis_Derecha");
                this.match("S_Llave_Izquierda");
                this.declaracionComentario();
                this.listaDeclaracion();
                this.declaracionComentario();
                this.agregarTraduccion("}", "S_Llave_Derecha");
                this.match("S_Llave_Derecha");
                this.ambito = "Global";
                this.esFuncion = false;
            } else if(this.tokenActual.getDescripcion == "S_Coma") {
                this.traductor = "var " + this.traductor;
                this.agregarVariable(this.tipo, this.TK_Identificador, this.fila, this.ambito);   
                this.tipo = this.tipoTemporal;
                this.listaAsignacionGlobal();
                this.match("S_Punto_Coma");
            } else if(this.tokenActual.getDescripcion == "S_Punto_Coma") {
                this.traductor = "var " + this.traductor; 
                this.match("S_Punto_Coma");
                this.agregarTraduccion(this.traductor, "TK_Cadena");
                this.agregarVariable(this.tipo, this.TK_Identificador, this.fila, this.ambito);   
            }
        }
    }

    public listaAsignacionGlobal() {
        this.masElementosGlobal();
    }

    public listaAsignacionGlobal2() {
        this.traductor = this.traductor + this.tokenActual.getLexema;
        this.TK_Identificador = this.tokenActual.getLexema;
        this.fila = this.tokenActual.getFila;
        this.agregarVariable(this.tipo, this.TK_Identificador, this.fila, this.ambito); 
        this.tipo = this.tipoTemporal;
        this.match("TK_Identificador");
        this.asignacionVariableGlobal();
        this.masElementosGlobal();
    }

    public masElementosGlobal() {
        if(this.tokenActual.getDescripcion == "S_Coma") {
            this.traductor = this.traductor + ",";
            this.match("S_Coma");
            this.listaAsignacionGlobal2();
        } else {
            //EPSILON
        }
    }

    public asignacionVariableGlobal() {

        if(this.tokenActual.getDescripcion == "S_Igual") {
            this.match("S_Igual");
            this.traductor = this.traductor + "=";
            this.expresion();
        } else {
            //EPSILON
        }
    }

    public valorVariableGlobal() {
        if(this.tokenActual.getDescripcion == "TK_Numero") {
            this.match("TK_Numero");
        } else if(this.tokenActual.getDescripcion == "TK_Cadena") {
            this.match("TK_Cadena");
        } else if(this.tokenActual.getDescripcion == "TK_Caracter") {
            this.match("TK_Caracter");
        } else if(this.tokenActual.getDescripcion == "TK_true") {
            this.match("TK_true");
        } else if(this.tokenActual.getDescripcion == "TK_false") {
            this.match("TK_false");
        } else if(this.tokenActual.getDescripcion == "TK_Identificador") {
            this.match("TK_Identificador");
            this.valorMetodoGlobal();
        }
    }

    public valorMetodoGlobal() {
        if(this.tokenActual.getDescripcion == "S_Parentesis_Izquierda") {
            this.match("S_Parentesis_Izquierda");
            this.tokenActual = this.arregloToken[this.indiceActual];
            if(this.tokenActual.getDescripcion == "S_Parentesis_Derecha") {
                this.match("S_Parentesis_Derecha");
            } else {
                //LISTADO DE ASIGNACIONES
                this.listaParametroAsignacion();
                this.match("S_Parentesis_Derecha");
            }
            
        } else {
            //EPSILON
        }
    }

    public otraDeclaracionGlobal(){
        if(this.tokenActual.getDescripcion!=null) {
            if(this.tokenActual.getDescripcion == 'TK_void') {
                this.declaracion();
                this.otraDeclaracionGlobal();
            }else if(this.tipoDeDatos.includes(this.tokenActual.getDescripcion)) {
                this.tipo = this.tokenActual.getLexema;
                this.declaracion();
                this.otraDeclaracionGlobal();
            }
        }
    }

    public metodoPrincipal() {
        this.esMetodo = true;
        this.match("TK_main");
        this.match("S_Parentesis_Izquierda");
        this.agregarTraduccion(this.traductor+ "():", "TK_Cadena");
        this.agregarTraduccion("{", "S_Llave_Izquierda");
        this.parametroPrincipal();
        this.match("S_Parentesis_Derecha");
        this.match("S_Llave_Izquierda");
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
        this.match("S_Llave_Derecha");
        this.agregarTraduccion("}", "S_Llave_Derecha");
        this.ambito = "Global";
        this.traductor = this.traductor + "if __name__ = \"__main__\": \n\t\tmain()";
        this.agregarTraduccion(this.traductor, "TK_Cadena");
        this.esMetodo = false;
    }

    public metodoVoid() {
        this.esMetodo = true;
        this.traductor = "def " + this.traductor + this.tokenActual.getLexema + "(";
        this.match("TK_Identificador");
        this.match("S_Parentesis_Izquierda");
        this.declaracionParametros();
        this.traductor = this.traductor  + "):";
        this.agregarTraduccion(this.traductor, "TK_Cadena");
        this.agregarTraduccion("{", "S_Llave_Izquierda");

        this.match("S_Parentesis_Derecha");
        this.match("S_Llave_Izquierda");
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
        this.match("S_Llave_Derecha");
        this.ambito = "Global";
        this.agregarTraduccion("}", "S_Llave_Derecha");
        this.esMetodo = false;
    }

    public parametroPrincipal() {
        if (this.tokenActual.getDescripcion == "TK_string")
        {
            this.match("TK_string");
            this.match("S_Corchete_Izquierda");
            this.match("S_Corchete_Derecha");
            this.match("TK_Identificador");
        } else {
            //EPSILON
        }
    }
    //DECLARACION PARAMETROS
    public declaracionParametros(){
        if(this.tipoDeDatos.includes(this.tokenActual.getDescripcion)) {
            this.tipo = this.tokenActual.getLexema;
            this.tipoVariable();
            this.listaParametro();
        } else {
            //EPSILON
        }
    }

    public listaParametro() {
        this.traductor = this.traductor + this.tokenActual.getLexema;
        this.agregarVariable(this.tipo, this.tokenActual.getLexema, this.tokenActual.getFila, this.ambito); 
        this.match("TK_Identificador");
        this.masParametros();
    }

    public masParametros() {
        if(this.tokenActual.getDescripcion == "S_Coma") {
            this.traductor = this.traductor + ",";
            this.match("S_Coma");
            this.tipoVariable();
            this.listaParametro();
        } else {
            //EPSILON
        }
    }

    //DECLARACION COMENTARIO
    public declaracionComentario() {
        this.comentario();
        this.otrosComentarios();
    }
    comentario() {
        if(this.tokenActual!=null) {
            if (this.tokenActual.getDescripcion == ("TK_Comentario_Linea"))
            {
                
                this.traductor = this.traductor + this.tokenActual.getLexema.replace("//", "#");
                this.agregarTraduccion(this.traductor, "TK_Cadena");
                this.match("TK_Comentario_Linea");
            } else if (this.tokenActual.getDescripcion == ("TK_Comentario_Multilinea"))
            {
                this.traductor = this.traductor + this.tokenActual.getLexema.replace("/*", "'''") ;
                this.traductor = this.traductor.replace("*/", "'''");
                this.agregarTraduccion(this.traductor, "TK_Cadena");
                this.match("TK_Comentario_Multilinea");
            }
            else
            {
                //EPSILON
            }
        }
    }
    public otrosComentarios() {
        if(this.tokenActual!=null) {
            if (this.tokenActual.getDescripcion == ("TK_Comentario_Linea")
            || this.tokenActual.getDescripcion == ("TK_Comentario_Multilinea"))
            {
                this.comentario();
                this.otrosComentarios();
            } else {
                //EPSILON
            }
        }
    }

    //LISTA DECLARACION
    public listaDeclaracion() {
        if(this.tokenActual != null) {
            if(this.tipoDeDatos.includes(this.tokenActual.getDescripcion)) {
                this.declaracionVariable();
            } else if (this.tokenActual.getDescripcion == ("TK_Comentario_Linea")
            || this.tokenActual.getDescripcion == ("TK_Comentario_Multilinea"))
            {
                this.declaracionComentario();
            } else if (this.tokenActual.getDescripcion == ("TK_if"))
            {
                this.DeclaracionIf();
            } else if (this.tokenActual.getDescripcion == ("TK_for"))
            {
                this.declaracionFor();
            } else if (this.tokenActual.getDescripcion == ("TK_while"))
            {
                this.declaracionWhile();
            } else if (this.tokenActual.getDescripcion == ("TK_switch"))
            {
                this.declaracionSwitch();
            } else if (this.tokenActual.getDescripcion == ("TK_do"))
            {
                this.declaracionDoWhile();
            } else if (this.tokenActual.getDescripcion == ("TK_console"))
            {
                this.declaracionConsole();
            } else if (this.tokenActual.getDescripcion == ("TK_Identificador"))
            {
                this.declaracionSinTipo();
            } else if (this.tokenActual.getDescripcion == ("TK_return"))
            {
                this.declaracionRetorno();
            } else if (this.tokenActual.getDescripcion == ("TK_break"))
            {
                this.break();
            } else if (this.tokenActual.getDescripcion == ("TK_continue"))
            {
                this.continue();
            } else {
                //EPSILON
            }
        }
    }
    public declaracionRetorno() {
        if(this.esMetodo == true) {
            this.traductor = this.traductor + "return";
            this.match("TK_return");
            this.match("S_Punto_Coma");
        } else if(this.esFuncion == true) {
            this.traductor = this.traductor + "return ";
            this.match("TK_return");
            this.condicionesReturn();
            this.agregarTraduccion(this.traductor, "TK_Cadena");
            this.match("S_Punto_Coma");
        }
        this.listaDeclaracion();
    }


    /**
     * DECLARACION CONSOLA
     */
    public declaracionConsole() {
        this.traductor = this.traductor + "print(";
        this.match("TK_console");
        this.match("S_Punto");
        this.match(this.tokenActual.getDescripcion);
        this.match("S_Parentesis_Izquierda");
        this.expresion();
        this.traductor = this.traductor + ")";
        this.match("S_Parentesis_Derecha");
        this.match("S_Punto_Coma");
        this.agregarTraduccion(this.traductor, "TK_Cadena");
        this.listaDeclaracion();
    }

    /**
     * DECLARACION VARIAABLE
     */
    public declaracionVariable() {
        this.declaracionComentario();
        this.asignacion();
        this.declaracionComentario();
        this.otraAsignacion();
        this.declaracionComentario();
        this.listaDeclaracion();
    }
    public asignacion() {
        this.tipoVariable();
        this.listaAsignacion();
        this.asignacionVariable();
        this.match("S_Punto_Coma");
        this.agregarTraduccion(this.traductor, "TK_Cadena");
    }

    public otraAsignacion() {
        if(this.tokenActual != null) {
            if(this.tipoDeDatos.includes(this.tokenActual.getDescripcion)) {
                this.declaracionComentario();
                this.asignacion();
                this.declaracionComentario();
                this.otraAsignacion();
                this.declaracionComentario();
                this.listaDeclaracion();
            }
        } else {
            //EPSILON
        }
    }

    public tipoVariable() {
        this.traductor = this.traductor+ "var ";
        if(this.tokenActual.getDescripcion == "TK_int") {
            this.match("TK_int");
            this.tipo = "int";
            this.tipoTemporal = "int";
        } else if(this.tokenActual.getDescripcion == "TK_double") {
            this.match("TK_double");
            this.tipo = "double";
            this.tipoTemporal = "double";
        } else if(this.tokenActual.getDescripcion == "TK_char") {
            this.match("TK_char");
            this.tipo = "char";
            this.tipoTemporal = "char";
        } else if(this.tokenActual.getDescripcion == "TK_bool") {
            this.match("TK_bool");
            this.tipo = "bool";
            this.tipoTemporal = "bool";
        } else if(this.tokenActual.getDescripcion == "TK_string") {
            this.match("TK_string");
            this.tipo = "string";
            this.tipoTemporal = "string"
        }
    }

    public listaAsignacion() {
        this.traductor = this.traductor + this.tokenActual.getLexema;
        this.TK_Identificador = this.tokenActual.getLexema;
        this.fila = this.tokenActual.getFila;
        this.match("TK_Identificador");
        this.agregarVariable(this.tipo, this.TK_Identificador, this.fila, this.ambito);
        this.tipo = this.tipoTemporal;
        if(this.tokenActual.getDescripcion == "S_Igual") {
            this.match("S_Igual");
            this.traductor = this.traductor + "=";
            this.expresion();
        } else {
            //EPSILON
        }
        this.masElementos();
    }


    public masElementos() {
        if(this.tokenActual.getDescripcion == "S_Coma") {
            this.traductor = this.traductor + ",";
            this.match("S_Coma");
            this.listaAsignacion();
        } else {
            this.agregarTraduccion(this.traductor, "TK_Cadena");
            //EPSILON
        }
    }

    public asignacionVariable() {
        if(this.tokenActual.getDescripcion == "S_Igual") {
            this.traductor = this.traductor + "= ";
            this.match("S_Igual");
            this.expresion();
        } else {
            //EPSILON
        }
    }

    /**
     * DECLARACION IF ELSE
     */
    public DeclaracionIf() {
        this.traductor = this.traductor + "if ";
        this.match("TK_if");
        this.match("S_Parentesis_Izquierda");
        this.condiciones();
        this.match("S_Parentesis_Derecha");
        this.match("S_Llave_Izquierda");

        this.agregarTraduccion(this.traductor + ":", "TK_Cadena");
        this.agregarTraduccion("{", "S_Llave_Izquierda");
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
        this.match("S_Llave_Derecha");
        this.agregarTraduccion("}", "S_Llave_Derecha");
        this.declaracionComentario();
        this.else();
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
    }

    /**
     * CONDICION IF
     */
    public condicion() {
        this.tipoCondicion();
        this.operacionRelacional();
        this.tipoCondicion();
    }

    public condicionFor(){
        this.match(this.tokenActual.getDescripcion);
        this.operacionRelacionalFor();
        this.traductor = this.traductor + this.tokenActual.getLexema;
        this.match(this.tokenActual.getDescripcion);
    }

    public tipoCondicion() {
        this.traductor = this.traductor + this.tokenActual.getLexema;
        if(this.tokenActual.getDescripcion == 'TK_Identificador') {
            this.match("TK_Identificador");
        } else if(this.tokenActual.getDescripcion == 'TK_Cadena') {
            this.match("TK_Cadena");
        } else if(this.tokenActual.getDescripcion == 'TK_Numero') {
            this.match("TK_Numero");
        } else if(this.tokenActual.getDescripcion == 'TK_Cadena') {
            this.match("TK_Cadena");
        } else if(this.tokenActual.getDescripcion == 'TK_null') {
            this.match("TK_null");
        } else if(this.tokenActual.getDescripcion == 'TK_true') {
            this.match("TK_true");
        } else if(this.tokenActual.getDescripcion == 'TK_false') {
            this.match("TK_false");
        } else if(this.tokenActual.getDescripcion == 'TK_Decimal') {
            this.match("TK_Decimal");
        }
    }

    public else() {
        if(this.tokenActual.getDescripcion == 'TK_else') {
            this.match("TK_else");
            this.tipoElse();
        } else {
            //EPSILON
        }
    }
    
    /**
     * TIPO ELSE
     */
    public tipoElse() {
        if(this.tokenActual.getDescripcion == 'TK_if') {
            this.traductor = this.traductor + "elif ";
            
            this.declaracionComentario();
            this.declaracionElseIf();
            this.declaracionComentario();
            this.agregarTraduccion("}", "S_Llave_Derecha"); 
        } else if(this.tokenActual.getDescripcion == 'S_Llave_Izquierda') {
            this.traductor = this.traductor + "else: "; 
            this.declaracionComentario();
            this.declaracionElse();
            this.declaracionComentario();
            this.agregarTraduccion("}", "S_Llave_Derecha");

        }
    }

    public declaracionElseIf() {
        this.declaracionComentario();
        this.elseIf();
        this.declaracionComentario();
        this.otroElseIf();
        this.declaracionComentario();
    }

    public elseIf() {
        if(this.tokenActual.getDescripcion == 'TK_if') {
            this.match("TK_if");
            this.match("S_Parentesis_Izquierda");
            this.condicion();
            this.match("S_Parentesis_Derecha");
            this.match("S_Llave_Izquierda");
            this.agregarTraduccion(this.traductor, "TK_Cadena");
            this.agregarTraduccion("{", "S_Llave_Izquierda");
            this.declaracionComentario();
            this.listaDeclaracion();
            this.declaracionComentario();
            this.match("S_Llave_Derecha");
        } else {
            //EPSILON
        }
    }

    public otroElseIf() {
        if(this.tokenActual.getDescripcion == 'TK_else') {
            this.declaracionComentario();
            this.else()
            this.declaracionComentario();
            this.elseIf();
            this.declaracionComentario();
            this.otroElseIf();
            this.declaracionComentario();
        } else {
            //EPSILON
        }
    }

    public declaracionElse() {
        this.match("S_Llave_Izquierda");
        this.declaracionComentario();
        this.agregarTraduccion(this.traductor + ":", "TK_Cadena");
        this.agregarTraduccion("{", "S_Llave_Izquierda");
        this.listaDeclaracion();
        this.declaracionComentario();
        this.match("S_Llave_Derecha");
    }

    public declaracionFor() {
        this.esSwitchRepeticion++;
        this.esRepeticion++;
        this.match("TK_for");
        this.match("S_Parentesis_Izquierda");
        //INICIALIZACION
        this.match("TK_int");
        this.traductor = this.traductor + "for " + this.tokenActual.getLexema + " in range(";
        this.match("TK_Identificador");
        this.match("S_Igual");
        this.traductor = this.traductor + this.tokenActual.getLexema + ", ";
        this.match("TK_Numero");
        this.match("S_Punto_Coma");
        //CONDICION
        this.condicionFor();
        this.match("S_Punto_Coma");
        //INCREMENTO
        this.match("TK_Identificador");
        if(this.tokenActual.getDescripcion == 'S_Suma') {
            this.match("S_Suma");
            this.match("S_Suma");
            this.traductor = this.traductor + "):";
        } else if(this.tokenActual.getDescripcion == 'S_Resta') {
            this.match("S_Resta");
            this.match("S_Resta");
            this.traductor = this.traductor + ", -1):";
        }
        this.agregarTraduccion(this.traductor, "TK_Cadena");
        this.agregarTraduccion("{", "S_Llave_Izquierda");
        this.match("S_Parentesis_Derecha");
        this.match("S_Llave_Izquierda");
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
        this.match("S_Llave_Derecha");
        this.agregarTraduccion("}", "S_Llave_Derecha");
        this.esSwitchRepeticion--;
        this.esRepeticion--;
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
    }

    public declaracionWhile() {
        this.esSwitchRepeticion++;
        this.esRepeticion++;
        this.traductor = this.traductor + "while ";
        this.match("TK_while");
        this.match("S_Parentesis_Izquierda");
        //CONDICION
        this.condiciones();
        this.match("S_Parentesis_Derecha");
        this.match("S_Llave_Izquierda");
        this.traductor = this.traductor + ":";
        this.agregarTraduccion(this.traductor, "TK_Cadena");
        this.agregarTraduccion("{", "S_Llave_Izquierda");

        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
        this.agregarTraduccion("}", "S_Llave_Derecha");
        this.match("S_Llave_Derecha");
        this.esSwitchRepeticion--;
        this.esRepeticion--;
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
    }

    public declaracionSwitch() {
        this.esSwitchRepeticion++;
        this.match("TK_switch");
        this.match("S_Parentesis_Izquierda");
        this.traductor = this.traductor + "def switch(case,"+this.tokenActual.getLexema + "):";
        this.agregarTraduccion(this.traductor, "TK_Cadena");
        this.agregarTraduccion("{", "S_Llave_Izquierda");
        this.agregarTraduccion("switcher = {", "TK_Cadena");

        this.agregarTraduccion("{", "S_Llave_Izquierda");

        this.match("TK_Identificador");
        this.match("S_Parentesis_Derecha");
        this.match("S_Llave_Izquierda");
        this.declaracionComentario();
        this.cuerpoSwitch();
        this.declaracionComentario();
        this.default();
        this.traductor = this.traductor + "}";
        this.agregarTraduccion(this.traductor, "TK_Cadena");
        this.agregarTraduccion("}", "S_Llave_Derecha");
        
        this.declaracionComentario();
        this.match("S_Llave_Derecha");
        this.esSwitchRepeticion--;
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
    }

    public cuerpoSwitch() {
        this.declaracionComentario();
        this.case();
        this.declaracionComentario();
        this.otroCase();
        this.declaracionComentario();
    }

    public case() {
        if(this.tokenActual != null) {
            if(this.tokenActual.getDescripcion == 'TK_case') {
                this.match("TK_case");
                this.tipoCase();
                this.agregarTraduccion(this.traductor + ":", "TK_Cadena");
                this.agregarTraduccion("{", "S_Llave_Izquierda");
                this.match("S_Dos_Puntos");
                this.declaracionComentario();
                this.listaDeclaracion();
                this.declaracionComentario();
                this.agregarTraduccion("}", "S_Llave_Derecha");
            } else {
                //EPSILON
            }
        }
    }

    public tipoCase() {
        this.traductor = this.traductor + this.tokenActual.getLexema;
        if(this.tokenActual.getDescripcion == 'TK_Identificador') {
            this.match("TK_Identificador");
        } else if(this.tokenActual.getDescripcion == 'TK_Numero') {
            this.match("TK_Numero");
        } else if(this.tokenActual.getDescripcion == 'TK_Cadena') {
            this.match("TK_Cadena");
        } else if(this.tokenActual.getDescripcion == 'TK_TK_Caracter') {
            this.match("TK_TK_Caracter");
        } else if(this.tokenActual.getDescripcion == 'TK_null') {
            this.match("TK_null");
        }
    }

    public otroCase() {
        if(this.tokenActual != null) {
            if(this.tokenActual.getDescripcion == 'TK_case') {
                this.traductor = this.traductor + ",";
                this.declaracionComentario();
                this.case();
                this.declaracionComentario();
                this.otroCase();
                this.declaracionComentario();
            } else {
                //EPSILON
            }
        }
    }

    public break() {
        if(this.esSwitchRepeticion != 0) {
            if(this.tokenActual.getDescripcion != null) {
                this.match("TK_break");
                this.traductor = this.traductor + "break";
                this.agregarTraduccion(this.traductor, "TK_Cadena");
                this.match("S_Punto_Coma");
                this.listaDeclaracion();
            }
        }
    }

    public continue() {
        if(this.esRepeticion != 0) {
            if(this.tokenActual.getDescripcion != null) {
                this.match("TK_continue");
                this.traductor = this.traductor + "continue";
                this.agregarTraduccion(this.traductor, "TK_Cadena");

                this.match("S_Punto_Coma");
                this.listaDeclaracion();
            }
        }
    }

    public default() {
        if(this.tokenActual != null) {
            if(this.tokenActual.getDescripcion == 'TK_default') {
                this.traductor = this.traductor + ",default";
                this.agregarTraduccion(this.traductor + ":", "TK_Cadena");
                this.agregarTraduccion("{", "S_Llave_Izquierda");
                this.match("TK_default");
                this.match("S_Dos_Puntos");
                this.declaracionComentario();
                this.listaDeclaracion();
                this.declaracionComentario();
                this.agregarTraduccion("}", "S_Llave_Derecha");
            } else {
                //EPSILON
            }
        }
    }


    public valorVariable() {
        if(this.tokenActual.getDescripcion == "TK_Numero") {
            this.match("TK_Numero");
        } else if(this.tokenActual.getDescripcion == "TK_Cadena") {
            this.match("TK_Cadena");
        //FALTA CARACTER
        } else if(this.tokenActual.getDescripcion == "TK_Caracter") {
            this.match("TK_Caracter");
        } else if(this.tokenActual.getDescripcion == "TK_true") {
            this.match("TK_true");
        } else if(this.tokenActual.getDescripcion == "TK_false") {
            this.match("TK_false");
        } else if(this.tokenActual.getDescripcion == "TK_Identificador") {
            this.match("TK_Identificador");
        }
    }

    public operacionRelacional() {
        if(this.tokenActual.getDescripcion == "S_Menor") {
            this.match("S_Menor");
            this.traductor = this.traductor + "<";
            this.tokenActual = this.arregloToken[this.indiceActual];
            if(this.tokenActual.getDescripcion == "S_Igual") {
                this.traductor = this.traductor + "=";
                this.match("S_Igual");
            } else {
                //EPSILON
            }
        } else if(this.tokenActual.getDescripcion == "S_Mayor") {
            this.match("S_Mayor");
            this.traductor = this.traductor + ">";
            this.tokenActual = this.arregloToken[this.indiceActual];
            if(this.tokenActual.getDescripcion == "S_Igual") {
                this.traductor = this.traductor + "=";
                this.match("S_Igual");
            } else {
                //EPSILON
            }
        } if(this.tokenActual.getDescripcion == "S_Igual") {
            this.match("S_Igual");
            this.match("S_Igual");
            this.traductor = this.traductor + "==";
        } if(this.tokenActual.getDescripcion == "S_Exclamacion") {
            this.match("S_Exclamacion");
            this.match("S_Igual");
            this.traductor = this.traductor + "!=";
        } 
    }
    public operacionRelacionalFor() {
        if(this.tokenActual.getDescripcion == "S_Menor") {
            this.match("S_Menor");
            this.tokenActual = this.arregloToken[this.indiceActual];
            if(this.tokenActual.getDescripcion == "S_Igual") {
                this.match("S_Igual");
            } else {
                //EPSILON
            }
        } else if(this.tokenActual.getDescripcion == "S_Mayor") {
            this.match("S_Mayor");
            this.tokenActual = this.arregloToken[this.indiceActual];
            if(this.tokenActual.getDescripcion == "S_Igual") {
                this.match("S_Igual");
            } else {
                //EPSILON
            }
        } 
    }
    public operacionLogicoAndOr() {
        if(this.tokenActual.getDescripcion == "S_Pleca") {
            this.match("S_Pleca");
            this.match("S_Pleca");
        } else if(this.tokenActual.getDescripcion == "S_Ampersand") {
            this.match("S_Ampersand");
            this.match("S_Ampersand");
        }
    }

    public operacionLogicoNot() {
        if(this.tokenActual.getDescripcion == "S_Exclamacion") {
            this.match("S_Exclamacion");
        }
    }

    public declaracionDoWhile() {
        this.esSwitchRepeticion++;
        this.esRepeticion++;
        this.match("TK_do");
        this.traductor = this.traductor + "while True:"
        this.agregarTraduccion(this.traductor, "TK_Cadena");
        this.agregarTraduccion("{", "S_Llave_Izquierda");
        this.match("S_Llave_Izquierda");
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
        this.match("S_Llave_Derecha");
        this.match("TK_while");
        this.match("S_Parentesis_Izquierda");
        //CONDICION
        this.traductor = this.traductor + "if (";
        this.condiciones();
        this.traductor = this.traductor + "):";
        this.agregarTraduccion(this.traductor, "TK_Cadena");
        this.agregarTraduccion("{", "S_Llave_Izquierda");
        this.agregarTraduccion("break", "TK_Cadena");
        this.agregarTraduccion("}", "S_Llave_Derecha");
        this.agregarTraduccion("}", "S_Llave_Derecha");
        this.match("S_Parentesis_Derecha");
        this.match("S_Punto_Coma");
        this.esSwitchRepeticion--;
        this.esRepeticion--;
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
    }

    /**
     * DECLARACION SIN TIPO
     */
    public declaracionSinTipo() {
        this.traductor = this.traductor + this.tokenActual.getLexema;
        this.TK_Identificador = this.tokenActual.getLexema;
        this.match("TK_Identificador");
        this.match("S_Igual");
        this.traductor = this.traductor + "=";
        this.expresion();
        this.match("S_Punto_Coma");
        if(TablaControlador.getInstancia().buscar(this.TK_Identificador) == false){
            this.salidaError = this.salidaError + "\n" + ">> Error Sintactico: La variable '" + this.TK_Identificador + "' no ha sido declarada, Linea: "  + this.fila; 
        } 
        this.agregarTraduccion(this.traductor, "TK_Cadena");
        this.declaracionComentario();
        this.listaDeclaracion();
        this.declaracionComentario();
    }

    /**
     * EXPRESION
     */
    public expresion() {
        this.termino();
        this.expresionPrima();
    }

    public termino() {
        this.factor();
        this.terminoPrima();
    }

    public expresionPrima() {
        if (this.tokenActual.lexema == "+")
        {
            this.traductor = this.traductor + "+";
            this.match(this.tokenActual.getDescripcion);
            this.evaluarSiguiente(this.tokenActual.getDescripcion);
        }
        else if (this.tokenActual.lexema == "-")
        {
            this.traductor = this.traductor + "-";
            this.match(this.tokenActual.getDescripcion);
            this.evaluarSiguiente(this.tokenActual.getDescripcion);
        }
        else if (this.tokenActual.lexema == "|")
        {
            this.match(this.tokenActual.getDescripcion);
            this.match(this.tokenActual.getDescripcion);
            this.evaluarSiguiente(this.tokenActual.getDescripcion);
        }else if (this.tokenActual.lexema == "&")
        {
            this.match(this.tokenActual.getDescripcion);
            this.match(this.tokenActual.getDescripcion);
            this.evaluarSiguiente(this.tokenActual.getDescripcion);
        } else
        if(this.tokenActual.getDescripcion == "S_Menor") {
            this.match("S_Menor");
            this.tokenActual = this.arregloToken[this.indiceActual];
            if(this.tokenActual.getDescripcion == "S_Igual") {
                this.match("S_Igual");
                this.evaluarSiguiente(this.tokenActual.getDescripcion);
            } else {
                //EPSILON
                this.evaluarSiguiente(this.tokenActual.getDescripcion);
            }
        } else if(this.tokenActual.getDescripcion == "S_Mayor") {
            this.match("S_Mayor");
            this.tokenActual = this.arregloToken[this.indiceActual];
            if(this.tokenActual.getDescripcion == "S_Igual") {
                this.match("S_Igual");
                this.evaluarSiguiente(this.tokenActual.getDescripcion);
            } else {
                //EPSILON
                this.evaluarSiguiente(this.tokenActual.getDescripcion);
            }
        } else if(this.tokenActual.getDescripcion == "S_Igual") {
            this.match("S_Igual");
            this.match("S_Igual");
            this.evaluarSiguiente(this.tokenActual.getDescripcion);
        } else if(this.tokenActual.getDescripcion == "S_Exclamacion") {
            this.match("S_Exclamacion");
            this.match("S_Igual");
            this.evaluarSiguiente(this.tokenActual.getDescripcion);
        }
        else
        {
            //EPSILON
        }
    }

    public evaluarSiguiente(texto:string) {
        if (this.tokenActual.lexema != texto)
        {
            //console.error(this.tokenActual.lexema)
            this.termino();
            this.expresionPrima();
        } else {
            //console.error(texto)
        }
    }

    public factor() {
        if (this.tokenActual.lexema == "(")
        {
            this.match(this.tokenActual.getDescripcion);
            this.expresion();
            this.match("S_Parentesis_Derecha");
        }
        else if (this.tokenActual.getDescripcion == ("TK_Numero") 
        || this.tokenActual.getDescripcion == ("TK_Cadena")
        || this.tokenActual.getDescripcion == ("TK_Decimal")
        || this.tokenActual.getDescripcion == ("TK_HTML")
        || this.tokenActual.getDescripcion == ("TK_true")
        || this.tokenActual.getDescripcion == ("TK_Caracter")
        || this.tokenActual.getDescripcion == ("TK_false"))
        {
            if (this.tokenActual.getDescripcion == "TK_HTML") {
                this.getHtml(this.tokenActual.getLexema);
            }
            this.traductor = this.traductor +this.tokenActual.getLexema; 
            this.match(this.tokenActual.getDescripcion);
        } else if (this.tokenActual.getDescripcion == ("TK_Identificador"))
        {
            this.traductor = this.traductor +this.tokenActual.getLexema; 
            this.match(this.tokenActual.getDescripcion);
            this.valorMetodoGlobal();
        } else {
            this.salidaError = this.salidaError + "\n" + 
                ">> Error Sintactico: Se esperaba cualquier tipo de dato en lugar de " + this.tokenActual.getDescripcion +
                " en la Fila: " + this.tokenActual.fila + " y Columna: " +this.tokenActual.columna;
        }
    }

    public terminoPrima() {
        if (this.tokenActual.lexema == "*")
        {
            this.traductor = this.traductor + "*"; 
            this.match(this.tokenActual.getDescripcion);
            this.evaluarSiguiente(this.tokenActual.getDescripcion);
        }
        else if (this.tokenActual.lexema == "/")
        {
            this.traductor = this.traductor + "/";
            this.match(this.tokenActual.getDescripcion);
            this.evaluarSiguiente(this.tokenActual.getDescripcion);
        }
        else
        {
            //EPSILON
        }
    }

    public listaParametroAsignacion() {
        this.expresion();
        this.masParametrosAsignacion();
    }

    public masParametrosAsignacion() {
        if(this.tokenActual.getDescripcion == "S_Coma") {
            this.match("S_Coma");
            this.listaParametroAsignacion();
        } else {
            //EPSILON
        }
    }

    public condiciones() {
        if(this.tokenActual.getDescripcion != "S_Parentesis_Derecha") {
            this.expresion2();
            this.masCondiciones();
        }
    }
    public masCondiciones() {
        if(this.tokenActual.getDescripcion == "S_Pleca") {
            this.match("S_Pleca");
            this.match("S_Pleca");
            this.traductor = this.traductor + "||";
        }if(this.tokenActual.getDescripcion == "S_Ampersand") {
            this.match("S_Ampersand");
            this.match("S_Ampersand");
            this.traductor = this.traductor + "&&";
        } else {
            //EPSILON
        }
        this.condiciones();
    }

    public expresion2() {
        this.termino2();
        this.expresionPrima2();
    }

    public termino2() {
        this.factor2();
        this.terminoPrima2();
    }
    public expresionPrima2() {
        if (this.tokenActual.getDescripcion != null)
        {
        if (this.tokenActual.lexema == "+")
        {
            this.traductor = this.traductor + "+";
            this.match(this.tokenActual.getDescripcion);
            this.evaluarSiguiente2(this.tokenActual.getDescripcion);
        }
        else if (this.tokenActual.lexema == "-")
        {
            this.traductor = this.traductor + "-";
            this.match(this.tokenActual.getDescripcion);
            this.evaluarSiguiente(this.tokenActual.getDescripcion);
        }else if(this.tokenActual.getDescripcion == "S_Menor") {
            this.traductor = this.traductor + "<";
            this.match("S_Menor");
            this.tokenActual = this.arregloToken[this.indiceActual];
            if(this.tokenActual.getDescripcion == "S_Igual") {
                this.match("S_Igual");
                this.traductor = this.traductor + "=";
                this.evaluarSiguiente2(this.tokenActual.getDescripcion);
            } else {
                //EPSILON
                this.evaluarSiguiente2(this.tokenActual.getDescripcion);
            }
        } else if(this.tokenActual.getDescripcion == "S_Mayor") {
            this.match("S_Mayor");
            this.traductor= this.traductor + ">";
            this.tokenActual = this.arregloToken[this.indiceActual];
            if(this.tokenActual.getDescripcion == "S_Igual") {
                this.match("S_Igual");
                this.traductor= this.traductor + "=";
                this.evaluarSiguiente2(this.tokenActual.getDescripcion);
            } else {
                //EPSILON
                this.evaluarSiguiente2(this.tokenActual.getDescripcion);
            }
        } else if(this.tokenActual.getDescripcion == "S_Igual") {
            this.match("S_Igual");
            this.match("S_Igual");
            this.traductor = this.traductor + "==";
            this.evaluarSiguiente2(this.tokenActual.getDescripcion);
        } else if(this.tokenActual.getDescripcion == "S_Exclamacion") {
            this.match("S_Exclamacion");
            this.match("S_Igual");
            this.traductor = this.traductor + "!=";
            this.evaluarSiguiente2(this.tokenActual.getDescripcion);
        }
        else
        {
            //EPSILON
        }   
        }
    }
    
    public evaluarSiguiente2(texto:string) {
        if (this.tokenActual.lexema != texto)
        {
            this.termino2();
            this.expresionPrima2();
        } else {
            //EPSILON
        }
    }

    public factor2() {
        if(this.tokenActual.getDescripcion!=null) {
            if (this.tokenActual.lexema == "(")
            {
                this.match(this.tokenActual.getDescripcion);
                this.expresion2();
                this.match("S_Parentesis_Derecha");
            }
            else if (this.tokenActual.getDescripcion == ("TK_Numero") 
            || this.tokenActual.getDescripcion == ("TK_Cadena")
            || this.tokenActual.getDescripcion == ("TK_Decimal")
            || this.tokenActual.getDescripcion == ("TK_HTML")
            || this.tokenActual.getDescripcion == ("TK_Caracter")
            || this.tokenActual.getDescripcion == ("TK_true")
            || this.tokenActual.getDescripcion == ("TK_false"))
            {
                this.traductor = this.traductor + this.tokenActual.getLexema;
                this.match(this.tokenActual.getDescripcion);
            } else if (this.tokenActual.getDescripcion == ("TK_Identificador"))
            {
                this.traductor = this.traductor + this.tokenActual.getLexema;
                this.match(this.tokenActual.getDescripcion);
            } else if (this.tokenActual.getDescripcion == ("S_Exclamacion"))
            {
                this.traductor = this.traductor + "!";
                this.match("S_Exclamacion");
                this.tokenActual = this.arregloToken[this.indiceActual];
                if(this.tokenActual.getDescripcion == "TK_Identificador") {
                    this.traductor = this.traductor + this.tokenActual.getLexema;
                    this.match("TK_Identificador");
                } else if(this.tokenActual.getDescripcion == "TK_true" || this.tokenActual.getDescripcion == "TK_false") {
                    this.traductor = this.traductor + this.tokenActual.getLexema;
                    this.match(this.tokenActual.getDescripcion);
                }
            } else {
                this.salidaError = this.salidaError + "\n" + 
                ">> Error Sintactico: Se esperaba cualquier tipo de dato en lugar de " + this.tokenActual.getDescripcion +
                " en la Fila: " + this.tokenActual.fila + " y Columna: " +this.tokenActual.columna;
            }
        }
    }

    public terminoPrima2() {
        if(this.tokenActual.getDescripcion!=null) {
            if (this.tokenActual.lexema == "*")
            {
                this.traductor = this.traductor + "*";
                this.match(this.tokenActual.getDescripcion);
                this.evaluarSiguiente2(this.tokenActual.getDescripcion);
            }
            else if (this.tokenActual.lexema == "/")
            {
                this.traductor = this.traductor + "/";
                this.match(this.tokenActual.getDescripcion);
                this.evaluarSiguiente2(this.tokenActual.getDescripcion);
            }
            else
            {
                //EPSILON
            }
        }
    }


    public condicionesReturn() {
        if(this.tokenActual.getDescripcion != "S_Punto_Coma") {
            this.expresion2();
            this.masCondicione3();
        }
    }

    public masCondicione3() {
        if(this.tokenActual.getDescripcion == "S_Pleca") {
            this.match("S_Pleca");
            this.match("S_Pleca");
            this.traductor = this.traductor + "||";
        }if(this.tokenActual.getDescripcion == "S_Ampersand") {
            this.match("S_Ampersand");
            this.match("S_Ampersand");
            this.traductor = this.traductor + "&&";
        } else {
            //EPSILON
        }
        this.condicionesReturn();
    }

    public expresion3() {
        this.termino3();
        this.expresionPrima3();
    }

    public termino3() {
        this.factor3();
        this.terminoPrima3();
    }

    public expresionPrima3() {
        if (this.tokenActual.getDescripcion != null)
        {
        if (this.tokenActual.lexema == "+")
        {
            this.match(this.tokenActual.getDescripcion);
            this.evaluarSiguiente3(this.tokenActual.getDescripcion);
        }
        else if (this.tokenActual.lexema == "-")
        {
            this.match(this.tokenActual.getDescripcion);
            this.evaluarSiguiente(this.tokenActual.getDescripcion);
        }else if(this.tokenActual.getDescripcion == "S_Menor") {
            this.match("S_Menor");
            this.tokenActual = this.arregloToken[this.indiceActual];
            if(this.tokenActual.getDescripcion == "S_Igual") {
                this.match("S_Igual");
                this.evaluarSiguiente3(this.tokenActual.getDescripcion);
            } else {
                //EPSILON
                this.evaluarSiguiente3(this.tokenActual.getDescripcion);
            }
        } else if(this.tokenActual.getDescripcion == "S_Mayor") {
            this.match("S_Mayor");
            this.tokenActual = this.arregloToken[this.indiceActual];
            if(this.tokenActual.getDescripcion == "S_Igual") {
                this.match("S_Igual");
                this.evaluarSiguiente3(this.tokenActual.getDescripcion);
            } else {
                //EPSILON
                this.evaluarSiguiente3(this.tokenActual.getDescripcion);
            }
        } else if(this.tokenActual.getDescripcion == "S_Igual") {
            this.match("S_Igual");
            this.match("S_Igual");
            this.evaluarSiguiente3(this.tokenActual.getDescripcion);
        } else if(this.tokenActual.getDescripcion == "S_Exclamacion") {
            this.match("S_Exclamacion");
            this.match("S_Igual");
            this.evaluarSiguiente3(this.tokenActual.getDescripcion);
        }
        else
        {
            //EPSILON
        }   
        }
    }

    public evaluarSiguiente3(texto:string) {
        if (this.tokenActual.lexema != texto)
        {
            this.termino3();
            this.expresionPrima3();
        } else {
            //EPSILON
        }
    }

    public factor3() {
        if(this.tokenActual.getDescripcion!=null) {
            if (this.tokenActual.lexema == "(")
            {
                this.match(this.tokenActual.getDescripcion);
                this.expresion3();
                this.match("S_Parentesis_Derecha");
            }
            else if (this.tokenActual.getDescripcion == ("TK_Numero") 
            || this.tokenActual.getDescripcion == ("TK_Cadena")
            || this.tokenActual.getDescripcion == ("TK_Decimal")
            || this.tokenActual.getDescripcion == ("TK_HTML")
            || this.tokenActual.getDescripcion == ("TK_Caracter")
            || this.tokenActual.getDescripcion == ("TK_true")
            || this.tokenActual.getDescripcion == ("TK_false"))
            {
                this.match(this.tokenActual.getDescripcion);
            } else if (this.tokenActual.getDescripcion == ("TK_Identificador"))
            {
                this.match(this.tokenActual.getDescripcion);
            } else if (this.tokenActual.getDescripcion == ("S_Exclamacion"))
            {
                this.match("S_Exclamacion");
                this.tokenActual = this.arregloToken[this.indiceActual];
                if(this.tokenActual.getDescripcion == "TK_Identificador") {
                    this.match("TK_Identificador");
                } else if(this.tokenActual.getDescripcion == "TK_true" || this.tokenActual.getDescripcion == "TK_false") {
                    this.match(this.tokenActual.getDescripcion);
                }
            } else {
                this.salidaError = this.salidaError + "\n" + 
                ">> Error Sintactico: Se esperaba cualquier tipo de dato en lugar de " + this.tokenActual.getDescripcion +
                " en la Fila: " + this.tokenActual.fila + " y Columna: " +this.tokenActual.columna;
            }
        }
    }

    public terminoPrima3() {
        if(this.tokenActual.getDescripcion!=null) {
            if (this.tokenActual.lexema == "*")
            {
                this.traductor = this.traductor + "*";
                this.match(this.tokenActual.getDescripcion);
                this.evaluarSiguiente3(this.tokenActual.getDescripcion);
            }
            else if (this.tokenActual.lexema == "/")
            {
                this.traductor = this.traductor + "/";
                this.match(this.tokenActual.getDescripcion);
                this.evaluarSiguiente3(this.tokenActual.getDescripcion);
            }
            else
            {
                //EPSILON
            }
        }
    }

    /**
     * METODO MATCH COINCIDE LOS TOKENS
     */
    public match(token:string)
    {
        if(this.tokenActual!=null){
            if (this.tokenActual.getDescripcion!=token)
            {
                this.salidaError = this.salidaError + "\n" + 
                ">> Error Sintactico: Se esperaba " + token + " en lugar de " + this.tokenActual.getDescripcion +
                " en la Fila: " + this.tokenActual.fila + " y Columna: " +this.tokenActual.columna;

                for (let indiceActual = this.indiceActual; indiceActual < this.arregloToken.length; indiceActual++) {
                    console.log(this.tokenActual.getDescripcion)
                    this.tokenActual = this.arregloToken[this.indiceActual];
                    if(this.tokenActual.getDescripcion == "S_Punto_Coma" 
                    || this.tokenActual.getDescripcion == "S_Llave_Derecha"
                    || this.tokenActual.getDescripcion == "S_Llave_Izquierda"
                    || this.tokenActual.getDescripcion == "TK_void"
                    || this.tokenActual.getDescripcion == "TK_int"
                    || this.tokenActual.getDescripcion == "TK_string"
                    || this.tokenActual.getDescripcion == "TK_double"
                    || this.tokenActual.getDescripcion == "TK_char"
                    || this.tokenActual.getDescripcion == "TK_bool") {
                        this.tokenActual = this.arregloToken[this.indiceActual];
                        break;
                    }
                    this.indiceActual += 1;
                }
            }

            if (this.tokenActual.getDescripcion==token)
            {
                this.indiceActual += 1;
                this.tokenActual = this.arregloToken[this.indiceActual];
            }
        }
    }

    /**
     * INSERTAR VARIABLES
     */
    public agregarVariable(tipo: string, TK_Identificador: string, fila: number, ambito: string){
        if(TablaControlador.getInstancia().buscar(TK_Identificador, ambito) == false){
            TablaControlador.getInstancia().agregar(TK_Identificador, tipo, ambito, fila);
        } else {
            this.salidaError = this.salidaError + "\n" + ">> Error Sintactico: La variable '" + TK_Identificador + "' ya fue declarada, Linea: " + fila;
        }
        this.fila = 0;
        this.TK_Identificador = this.tipo = "";
    }

    /**
     * OBTIENE EL HTML A TRADUCITR
     */
    public getHtml( str:string ){
        str = str.replace("'", " ").trim();
        var nuevoElemento: string = "";

        for (let i = 0; i < str.length; i++) {
            const element = str[i];

            if(element == "<"){
                if(nuevoElemento != ""){
                    this.elementosHTML.push(nuevoElemento.trim());
                }  
                nuevoElemento = "";
                nuevoElemento += element; 
                
                for (let j = i+1; j < str.length; j++) {
                    const e = str[j];
                    nuevoElemento += e;
                    if( e == ">"){
                        if( nuevoElemento.includes("</") ){
                            this.elementosHTML.push("}");
                            this.elementosHTML.push(nuevoElemento.trim());
                        } else {
                              
                            this.elementosHTML.push(nuevoElemento.trim());
                            if (!nuevoElemento.includes("br") && !nuevoElemento.includes("hr")) {   
                                this.elementosHTML.push("{");
                            }
                        }
                        i  = j;  
                        nuevoElemento = "";
                        break;
                    }  
                }
            } else {
                nuevoElemento += element; 
            }   
        }
        this.elementosHTML.forEach(e => {
            if(!(e.includes("</"))){
                if( e.includes("<") && e.includes(">")){
                   if (e.toLocaleLowerCase().includes("style")) {
                    
                    var splited = e.toLowerCase().split("style=");     
                    this.elementosJSON.push( new Traduccion( '"' + splited[0].replace('<', "").replace(">", "").toLocaleUpperCase() + '"' + ":{", "TK_Cadena") );
                    this.elementosJSON.push( new Traduccion("{", "S_Llave_Izquierda") );         
                    this.elementosJSON.push( new Traduccion( '"' + "STYLE" + '":' + splited[1].replace('<', "").replace(">", ""), "TK_Cadena") );
                    
                } else {
                        e = e.replace("<", '"').replace(">", '"');
                        this.elementosJSON.push( new Traduccion(e.toLocaleUpperCase() + ":{", "TK_Cadena") );
                        this.elementosJSON.push( new Traduccion("{", "S_Llave_Izquierda") );         
                    }
                } else {
                    if((e != "}") && (e != "{")){
                        this.elementosJSON.push( new Traduccion("\"TEXTO\": "+ '"' +e + '"', "TK_Cadena") );
                    }
                }
            } else {
                this.elementosJSON.push( new Traduccion("}", "TK_Cadena") );
                this.elementosJSON.push( new Traduccion("}", "S_Llave_Derecha") );
            }
        });
       
    }
    
    /**
     * INSERTAR ELEMENTOS
     */
    public agregarTraduccion( lexema: string, getDescripcion: string ){
        if (lexema != "") {
            this.arrayTraducido.push( new Traduccion(lexema, getDescripcion) );
        }  
        this.traductor = "";
    }

    /**
     * LIMPIAR VARIABLES
     */
    public clear(){
        this.arrayTraducido = [];
        this.elementosHTML = [];
        this.elementosJSON = [];
        this.traductor = "";
        this.salidaError = "";
    } 

    /**
     * MOSTRAR TRADUCCION
     */
    public verTraduccion(): string {
        var i:number = 0; 
        var tabulaciones:string = "";
        var nuevoElemento:string = "";
        for (let indiceActual = 0; indiceActual < this.arrayTraducido.length; indiceActual++) {
            const element:Traduccion = this.arrayTraducido[indiceActual];
            
            if (element.getDescripcion == "S_Llave_Izquierda") {
                i++;
                tabulaciones = "";
                for (let j = 0; j < i; j++) {
                    tabulaciones = tabulaciones + "\t";
                }    
            } else if(element.getDescripcion == "S_Llave_Derecha"){
                i--;
                tabulaciones = "";
                for (let j = 0; j < i; j++) {
                    tabulaciones = tabulaciones + "\t";
                }
            } else {
                nuevoElemento = nuevoElemento + "\n" + tabulaciones + element.getLexema;
            }
        }
        return nuevoElemento;   
    }

    /**
     * MOSTRAR HTML
     */
    public verHTML(): string {
        var i:number = 0; 
        var tabulaciones:string = "";
        var nuevoElemento:string = "";
        for (let indiceActual = 0; indiceActual < this.elementosHTML.length; indiceActual++) {
            const element:string = this.elementosHTML[indiceActual];
            
            if (element == "{") {
                i++;
                tabulaciones = "";
                for (let j = 0; j < i; j++) {
                    tabulaciones = tabulaciones + "\t";
                }    
            } else if(element == "}"){
                i--;
                tabulaciones = "";
                for (let j = 0; j < i; j++) {
                    tabulaciones = tabulaciones + "\t";
                }
            } else {
                nuevoElemento = nuevoElemento + "\n" + tabulaciones + element;
            }
        }
        return nuevoElemento;   
    }

    /**
     * MOSTRAR JSON
     */
    public verJSON(): string {
        var i:number = 0; 
        var tabulaciones:string = "";
        var nuevoElemento:string = "";
        for (let indiceActual = 0; indiceActual < this.elementosJSON.length; indiceActual++) {
            const element:Traduccion = this.elementosJSON[indiceActual];
            
            if (element.getDescripcion == "S_Llave_Izquierda") {
                i++;
                tabulaciones = "";
                for (let j = 0; j < i; j++) {
                    tabulaciones = tabulaciones + "\t";
                }    
            } else if(element.getDescripcion == "S_Llave_Derecha"){
                i--;
                tabulaciones = "";
                for (let j = 0; j < i; j++) {
                    tabulaciones = tabulaciones + "\t";
                }
            } else {
                nuevoElemento = nuevoElemento + "\n" + tabulaciones + element.getLexema;
            }
        }
        return nuevoElemento;   
    }

    /**
     * MOSTRAR ERRORES
     */
    public ObtenerErrores(): string {
        return this.salidaError;
    }
}