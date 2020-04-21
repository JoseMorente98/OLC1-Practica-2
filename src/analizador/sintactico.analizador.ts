import { Token } from 'src/modelo/token.modelo';

export class AnalizadorSintactico {
    //SINGLETON
    private static instancia: AnalizadorSintactico;
    //PROPIEDADES
    private arregloToken: Token[] = [];
    private indiceActual:number = 0;
    private tokenActual:Token = null;
    private esMetodo:boolean = false;
    private esFuncion:boolean = false;
    private esSwitchRepeticion:number = 0;
    private esRepeticion:number = 0;

    constructor() {
    }

    public static getInstancia(): AnalizadorSintactico {
        if (this.instancia == null) {
            this.instancia = new AnalizadorSintactico();
        }
        return this.instancia;
    }

    public scanner(arregloToken:Token[])
    {
        this.arregloToken = arregloToken;
        this.indiceActual = 0;
        this.tokenActual = arregloToken[this.indiceActual];
        this.inicio();
    }

    private inicio() {
        this.declaracionComentario();
        this.declaracionClase();
        this.declaracionComentario();
    }

    /**
     * DECLARACION DE CLASE
     */
    private declaracionClase() {
        if(this.tokenActual.getDescripcion == "TK_private") {
            this.match("TK_private");
            this.match("TK_class");
            this.match("TK_Identificador");
            this.match("S_Llave_Izquierda");
            this.declaracionComentario();
            this.declaracionGlobal();
            this.declaracionComentario();
            this.match("S_Llave_Derecha");
        } else {
            this.match("TK_class");
            this.match("TK_Identificador");
            this.match("S_Llave_Izquierda");
            this.declaracionComentario();
            this.declaracionGlobal();
            this.declaracionComentario();
            this.match("S_Llave_Derecha");
        }
    }

    /**
     * DECLARACION GLOBAL
     */
    private declaracionGlobal() {
        this.declaracionComentario();
        this.declaracion();
        this.declaracionComentario();
        this.otraDeclaracionGlobal();
        this.declaracionComentario();
    }

    /**
     * DECLARACION METODOS Y FUNCIONES
     */
    private declaracion(){
        if(this.tokenActual.getDescripcion!=null) {
            if(this.tokenActual.getDescripcion == 'TK_void') {
                this.match("TK_void");
                this.tokenActual = this.arregloToken[this.indiceActual];
                if(this.tokenActual.getDescripcion == 'TK_main') {
                    this.declaracionComentario();
                    this.metodoPrincipal();
                    this.declaracionComentario();
                } else if(this.tokenActual.getDescripcion == 'TK_Identificador') {
                    this.metodoVoid();
                }
            } else if(this.tokenActual.getDescripcion == "TK_int"
            || this.tokenActual.getDescripcion == "TK_double"
            || this.tokenActual.getDescripcion == "TK_char"
            || this.tokenActual.getDescripcion == "TK_bool"
            || this.tokenActual.getDescripcion == "TK_string"
            ) {
                this.declaracionComentario();
                this.tipoDeclaracion();
                this.declaracionComentario();
            }
        }
    }

    /**
     * DECLARACION FUNCIONES Y VARIABLES
     */
    private tipoDeclaracion() {
        if(this.tokenActual.getDescripcion == "TK_int") {
            this.match("TK_int");
            this.match("TK_Identificador");
            this.asignacionVariableGlobal();
            this.tokenActual = this.arregloToken[this.indiceActual];
            //ES FUNCION
            if(this.tokenActual.getDescripcion == "S_Parentesis_Izquierda") {
                this.esFuncion = true;
                this.match("S_Parentesis_Izquierda");
                this.declaracionParametros();
                this.match("S_Parentesis_Derecha");
                this.match("S_Llave_Izquierda");
                this.declaracionComentario();
                this.declaracionLista();
                this.declaracionComentario();
                this.match("S_Llave_Derecha");
                this.esFuncion = false;
            } else if(this.tokenActual.getDescripcion == "S_Coma") {
                this.listaAsignacionGlobal();
                this.match("S_Punto_Coma");
            } else if(this.tokenActual.getDescripcion == "S_Punto_Coma") {
                this.match("S_Punto_Coma");
            }
        } else if(this.tokenActual.getDescripcion == "TK_double") {
            this.match("TK_double");
            this.match("TK_Identificador");
            this.asignacionVariableGlobal();
            this.tokenActual = this.arregloToken[this.indiceActual];
            //ES FUNCION
            if(this.tokenActual.getDescripcion == "S_Parentesis_Izquierda") {
                this.esFuncion = true;
                this.match("S_Parentesis_Izquierda");
                this.declaracionParametros();
                this.match("S_Parentesis_Derecha");
                this.match("S_Llave_Izquierda");
                this.declaracionComentario();
                this.declaracionLista();
                this.declaracionComentario();
                this.match("S_Llave_Derecha");
                this.esFuncion = false;
            } else if(this.tokenActual.getDescripcion == "S_Coma") {
                this.listaAsignacionGlobal();
                this.match("S_Punto_Coma");
            } else if(this.tokenActual.getDescripcion == "S_Punto_Coma") {
                this.match("S_Punto_Coma");
            }
        } else if(this.tokenActual.getDescripcion == "TK_char") {
            this.match("TK_char");
            this.match("TK_Identificador");
            this.asignacionVariableGlobal();
            this.tokenActual = this.arregloToken[this.indiceActual];
            //ES FUNCION
            if(this.tokenActual.getDescripcion == "S_Parentesis_Izquierda") {
                this.esFuncion = true;
                this.match("S_Parentesis_Izquierda");
                this.declaracionParametros();
                this.match("S_Parentesis_Derecha");
                this.match("S_Llave_Izquierda");
                this.declaracionComentario();
                this.declaracionLista();
                this.declaracionComentario();
                this.match("S_Llave_Derecha");
                this.esFuncion = false;
            } else if(this.tokenActual.getDescripcion == "S_Coma") {
                this.listaAsignacionGlobal();
                this.match("S_Punto_Coma");
            } else if(this.tokenActual.getDescripcion == "S_Punto_Coma") {
                this.match("S_Punto_Coma");
            }
        } else if(this.tokenActual.getDescripcion == "TK_bool") {
            this.match("TK_bool");
            this.match("TK_Identificador");
            this.asignacionVariableGlobal();
            this.tokenActual = this.arregloToken[this.indiceActual];
            //ES FUNCION
            if(this.tokenActual.getDescripcion == "S_Parentesis_Izquierda") {
                this.esFuncion = true;
                this.match("S_Parentesis_Izquierda");
                this.declaracionParametros();
                this.match("S_Parentesis_Derecha");
                this.match("S_Llave_Izquierda");
                this.declaracionComentario();
                this.declaracionLista();
                this.declaracionComentario();
                this.match("S_Llave_Derecha");
                this.esFuncion = false;
            } else if(this.tokenActual.getDescripcion == "S_Coma") {
                this.listaAsignacionGlobal();
                this.match("S_Punto_Coma");
            } else if(this.tokenActual.getDescripcion == "S_Punto_Coma") {
                this.match("S_Punto_Coma");
            }
        } else if(this.tokenActual.getDescripcion == "TK_string") {
            this.match("TK_string");
            this.match("TK_Identificador");
            this.asignacionVariableGlobal();
            this.tokenActual = this.arregloToken[this.indiceActual];
            //ES FUNCION
            if(this.tokenActual.getDescripcion == "S_Parentesis_Izquierda") {
                this.esFuncion = true;
                this.match("S_Parentesis_Izquierda");
                this.declaracionParametros();
                this.match("S_Parentesis_Derecha");
                this.match("S_Llave_Izquierda");
                this.declaracionComentario();
                this.declaracionLista();
                this.declaracionComentario();
                this.match("S_Llave_Derecha");
                this.esFuncion = false;
            } else if(this.tokenActual.getDescripcion == "S_Coma") {
                this.listaAsignacionGlobal();
                this.match("S_Punto_Coma");
            } else if(this.tokenActual.getDescripcion == "S_Punto_Coma") {
                this.match("S_Punto_Coma");
            }
        }
    }

    /**
     * LISTA DE ASIGNACIONES GLOBALES
     */
    private listaAsignacionGlobal() {
        this.masElementosGlobal();
    }

    /**
     * LISTA DE ASIGNACIONES GLOBALES
     */
    private listaAsignacionGlobal2() {
        this.match("TK_Identificador");
        this.asignacionVariableGlobal();
        this.masElementosGlobal();
    }

    /**
     * MAS ELEMENTOS GLOBALES
     */
    private masElementosGlobal() {
        if(this.tokenActual.getDescripcion == "S_Coma") {
            this.match("S_Coma");
            this.listaAsignacionGlobal2();
        } else {
            //EPSILON
        }
    }

    /**
     * ASIGNACION A ELEMENTOS GLOBALES
     */
    private asignacionVariableGlobal() {
        if(this.tokenActual.getDescripcion == "S_Igual") {
            this.match("S_Igual");
            this.expresion();
        } else {
            //EPSILON
        }
    }

    /**
     * PARAMETROS METODOS
     */
    private valorMetodoGlobal() {
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

    /**
     * MAS DECLARACIONES
     */
    private otraDeclaracionGlobal(){
        if(this.tokenActual.getDescripcion!=null) {
            if(this.tokenActual.getDescripcion == 'TK_void') {
                this.declaracion();
                this.otraDeclaracionGlobal();
            }else if(this.tokenActual.getDescripcion == "TK_int"
            || this.tokenActual.getDescripcion == "TK_double"
            || this.tokenActual.getDescripcion == "TK_char"
            || this.tokenActual.getDescripcion == "TK_bool"
            || this.tokenActual.getDescripcion == "TK_string"
            ) {
                this.declaracion();
                this.otraDeclaracionGlobal();
            }
        }
    }

    /**
     * METODO PRINCIPAL
     */
    private metodoPrincipal() {
        this.esMetodo = true;
        this.match("TK_main");
        this.match("S_Parentesis_Izquierda");
        this.parametroPrincipal();
        this.match("S_Parentesis_Derecha");
        this.match("S_Llave_Izquierda");
        this.declaracionComentario();
        this.declaracionLista();
        this.declaracionComentario();
        this.match("S_Llave_Derecha");
        this.esMetodo = false;
    }

    /**
     * METODO VOID
     */
    private metodoVoid() {
        this.esMetodo = true;
        this.match("TK_Identificador");
        this.match("S_Parentesis_Izquierda");
        this.declaracionParametros();
        this.match("S_Parentesis_Derecha");
        this.match("S_Llave_Izquierda");
        this.declaracionComentario();
        this.declaracionLista();
        this.declaracionComentario();
        this.match("S_Llave_Derecha");
        this.esMetodo = false;
    }

    /**
     * PARAMETRO METODO PRINCIPAL
     */
    private parametroPrincipal() {
        if (this.tokenActual.getDescripcion == "TK_string")
        {
            this.match("TK_string");
            this.match("TK_Corchete_Izq");
            this.match("TK_Corchete_Der");
            this.match("TK_Identificador");
        } else {
            //EPSILON
        }
    }

    /**
     * DECLARACION PARAMETROS
     */
    private declaracionParametros(){
        if(this.tokenActual.getDescripcion == "TK_int"
            || this.tokenActual.getDescripcion == "TK_double"
            || this.tokenActual.getDescripcion == "TK_char"
            || this.tokenActual.getDescripcion == "TK_bool"
            || this.tokenActual.getDescripcion == "TK_string"
            ) {
            this.tipoVariable();
            this.listaParametro();
        } else {
            //EPSILON
        }
    }

    /**
     * DECLARACION LISTA DE PARAMETROS
     */
    private listaParametro() {
        this.match("TK_Identificador");
        this.masParametros();
    }

    /**
     * MAS PARAMETROS
     */
    private masParametros() {
        if(this.tokenActual.getDescripcion == "S_Coma") {
            this.match("S_Coma");
            this.tipoVariable();
            this.listaParametro();
        } else {
            //EPSILON
        }
    }

    /**
     * DECLARACION COMENTARIOS
     */
    private declaracionComentario() {
        this.comentario();
        this.otrosComentarios();
    }

    /**
     * COMENTARIO
     */
    comentario() {
        if(this.tokenActual!=null) {
            if (this.tokenActual.getDescripcion == ("TK_Comentario_Linea"))
            {
                this.match("TK_Comentario_Linea");
            } else if (this.tokenActual.getDescripcion == ("TK_Comentario_Multilinea"))
            {
                this.match("TK_Comentario_Multilinea");
            }
            else
            {
                //EPSILON
            }
        }
    }

    /**
     * OTROS COMENTARIOS
     */
    private otrosComentarios() {
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

    /**
     * LISTA DECLARACION
     */
    private declaracionLista() {
        if(this.tokenActual != null) {
            if(this.tokenActual.getDescripcion == "TK_int"
            || this.tokenActual.getDescripcion == "TK_double"
            || this.tokenActual.getDescripcion == "TK_char"
            || this.tokenActual.getDescripcion == "TK_bool"
            || this.tokenActual.getDescripcion == "TK_string"
            ) {
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
                this.declaracionBreak();
            } else if (this.tokenActual.getDescripcion == ("TK_continue"))
            {
                this.declaracionContinue();
            } else {
                //EPSILON
            }
        }
    }

    /**
     * DECLARACION RETORNO
     */
    private declaracionRetorno() {
        if(this.esMetodo == true) {
            this.match("TK_return");
            this.match("S_Punto_Coma");
        } else if(this.esFuncion == true) {
            this.match("TK_return");
            this.condicionesReturn();
            this.match("S_Punto_Coma");
        }
        this.declaracionLista();
    }

    /**
     * DECLARACION CONSOLA
     */
    private declaracionConsole() {
        this.match("TK_console");
        this.match("S_Punto");
        this.match("TK_write");
        this.match("S_Parentesis_Izquierda");
        this.expresion();
        this.match("S_Parentesis_Derecha");
        this.match("S_Punto_Coma");
        this.declaracionLista();
    }

    /**
     * DECLARACION VARIABLE LOCAL
     */
    private declaracionVariable() {
        this.declaracionComentario();
        this.asignacion();
        this.declaracionComentario();
        this.otraAsignacion();
        this.declaracionComentario();
        this.declaracionLista();
    }

    /**
     * ASIGNACION VARIABLE LOCAL
     */
    private asignacion() {
        this.tipoVariable();
        this.listaAsignacion();
        this.asignacionVariable();
        this.match("S_Punto_Coma");
    }

    /**
     * OTRA ASIGNACION
     */
    private otraAsignacion() {
        if(this.tokenActual != null) {
            if(this.tokenActual.getDescripcion == "TK_int"
            || this.tokenActual.getDescripcion == "TK_double"
            || this.tokenActual.getDescripcion == "TK_char"
            || this.tokenActual.getDescripcion == "TK_bool"
            || this.tokenActual.getDescripcion == "TK_string"
            ) {
                this.declaracionComentario();
                this.asignacion();
                this.declaracionComentario();
                this.otraAsignacion();
                this.declaracionComentario();
                this.declaracionLista();
            }
        } else {
            //EPSILON
        }
    }

    /**
     * TIPO VARIABLE LOCAL
     */
    private tipoVariable() {
        if(this.tokenActual.getDescripcion == "TK_int") {
            this.match("TK_int");
        } else if(this.tokenActual.getDescripcion == "TK_double") {
            this.match("TK_double");
        } else if(this.tokenActual.getDescripcion == "TK_char") {
            this.match("TK_char");
        } else if(this.tokenActual.getDescripcion == "TK_bool") {
            this.match("TK_bool");
        } else if(this.tokenActual.getDescripcion == "TK_string") {
            this.match("TK_string");
        }
    }

    /**
     * ASIGNACION VARIABLE LOCAL
     */
    private listaAsignacion() {
        this.match("TK_Identificador");
        if(this.tokenActual.getDescripcion == "S_Igual") {
            this.match("S_Igual");
            this.expresion();
        } else {
            //EPSILON
        }
        this.masElementos();
    }

    /**
     * MAS ELEMENTOS VARIABLE LOCAL
     */
    private masElementos() {
        if(this.tokenActual.getDescripcion == "S_Coma") {
            this.match("S_Coma");
            this.listaAsignacion();
        } else {
            //EPSILON
        }
    }

    /**
     * ASIGNACION VARIABLE LOCAL
     */
    private asignacionVariable() {
        if(this.tokenActual.getDescripcion!=null) {
            if(this.tokenActual.getDescripcion == "S_Igual") {
                this.match("S_Igual");
                this.expresion();
            } else {
                //EPSILON
            }
        }
    }

    /**
     * DECLARACION IF
     */
    private DeclaracionIf() {
        this.match("TK_if");
        this.match("S_Parentesis_Izquierda");
        this.condiciones();
        this.match("S_Parentesis_Derecha");
        this.match("S_Llave_Izquierda");
        this.declaracionComentario();
        this.declaracionLista();
        this.declaracionComentario();
        this.match("S_Llave_Derecha");
        this.declaracionComentario();
        this.else();
        this.declaracionComentario();
        this.declaracionLista();
        this.declaracionComentario();
    }

    /**
     * CONDICION
     */
    private condicion() {
        this.tipoCondicion();
        this.operacionRelacional();
        this.tipoCondicion();
    }

    /**
     * TIPO DE CONDICION
     */
    private tipoCondicion() {
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
        } else if(this.tokenActual.getDescripcion == 'TK_Caracter') {
            this.match("TK_Caracter");
        }
    }

    /**
     * ELSE
     */
    private else() {
        if(this.tokenActual.getDescripcion == 'TK_else') {
            this.match("TK_else");
            this.tipoElse();
        } else {
            //EPSILON
        }
    }

    /**
     * TIPO DE IF
     */
    private tipoElse() {
        if(this.tokenActual.getDescripcion == 'TK_if') {
            this.declaracionComentario();
            this.declaracionElseIf();
            this.declaracionComentario();
        } else if(this.tokenActual.getDescripcion == 'S_Llave_Izquierda') {
            this.declaracionComentario();
            this.declaracionElse();
            this.declaracionComentario();
        }
    }

    /**
     * DECLARACION ELSE IF
     */
    private declaracionElseIf() {
        this.declaracionComentario();
        this.elseIf();
        this.declaracionComentario();
        this.otroElseIf();
        this.declaracionComentario();
    }

    /**
     * ELSE IF
     */
    private elseIf() {
        if(this.tokenActual.getDescripcion == 'TK_if') {
            this.match("TK_if");
            this.match("S_Parentesis_Izquierda");
            this.condicion();
            this.match("S_Parentesis_Derecha");
            this.match("S_Llave_Izquierda");
            this.declaracionComentario();
            this.declaracionLista();
            this.declaracionComentario();
            this.match("S_Llave_Derecha");
        } else {
            //EPSILON
        }
    }

    /**
     * OTRO ELSE IF
     */
    private otroElseIf() {
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

    /**
     * DECLARACION ELSE
     */
    private declaracionElse() {
        this.match("S_Llave_Izquierda");
        this.declaracionComentario();
        this.declaracionLista();
        this.declaracionComentario();
        this.match("S_Llave_Derecha");
    }

    /**
     * DECLARACION FOR
     */
    private declaracionFor() {
        this.esSwitchRepeticion++;
        this.esRepeticion++;
        this.match("TK_for");
        this.match("S_Parentesis_Izquierda");
        //INICIALIZACION
        this.match("TK_int");
        this.match("TK_Identificador");
        this.match("S_Igual");
        this.match("TK_Numero");
        this.match("S_Punto_Coma");
        //CONDICION
        this.condicion();
        this.match("S_Punto_Coma");
        //INCREMENTO
        this.match("TK_Identificador");
        if(this.tokenActual.getDescripcion == 'S_Suma') {
            this.match("S_Suma");
            this.match("S_Suma");
        } else if(this.tokenActual.getDescripcion == 'S_Resta') {
            this.match("S_Resta");
            this.match("S_Resta");
        }
        this.match("S_Parentesis_Derecha");
        this.match("S_Llave_Izquierda");
        this.declaracionComentario();
        this.declaracionLista();
        this.declaracionComentario();
        this.match("S_Llave_Derecha");
        this.esSwitchRepeticion--;
        this.esRepeticion--;
        this.declaracionComentario();
        this.declaracionLista();
        this.declaracionComentario();
    }

    /**
     * DECLARACION WHILE
     */
    private declaracionWhile() {
        this.esSwitchRepeticion++;
        this.esRepeticion++;
        this.match("TK_while");
        this.match("S_Parentesis_Izquierda");
        //CONDICION
        this.condiciones();
        this.match("S_Parentesis_Derecha");
        this.match("S_Llave_Izquierda");
        this.declaracionComentario();
        this.declaracionLista();
        this.declaracionComentario();
        this.match("S_Llave_Derecha");
        this.esSwitchRepeticion--;
        this.esRepeticion--;
        this.declaracionComentario();
        this.declaracionLista();
        this.declaracionComentario();
    }

    /**
     * DECLARACION SWITCH
     */
    private declaracionSwitch() {
        this.esSwitchRepeticion++;
        this.match("TK_switch");
        this.match("S_Parentesis_Izquierda");
        this.match("TK_Identificador");
        this.match("S_Parentesis_Derecha");
        this.match("S_Llave_Izquierda");
        this.declaracionComentario();
        this.cuerpoSwitch();
        this.declaracionComentario();
        this.declaracionDefault();
        this.declaracionComentario();
        this.match("S_Llave_Derecha");
        this.esSwitchRepeticion--;
        this.declaracionComentario();
        this.declaracionLista();
        this.declaracionComentario();
    }

    /**
     * CUERPO SWITCH
     */
    private cuerpoSwitch() {
        this.declaracionComentario();
        this.case();
        this.declaracionComentario();
        this.otroCase();
        this.declaracionComentario();
    }

    /**
     * CASE
     */
    private case() {
        if(this.tokenActual != null) {
            if(this.tokenActual.getDescripcion == 'TK_case') {
                this.match("TK_case");
                this.tipoCase()
                this.match("S_Dos_Puntos");
                this.declaracionComentario();
                this.declaracionLista();
                this.declaracionComentario();
            } else {
                //EPSILON
            }
        }
    }

    /**
     * TIPO CASE
     */
    private tipoCase() {
        if(this.tokenActual.getDescripcion == 'TK_Identificador') {
            this.match("TK_Identificador");
        } else if(this.tokenActual.getDescripcion == 'TK_Cadena') {
            this.match("TK_Cadena");
        } else if(this.tokenActual.getDescripcion == 'TK_Numero') {
            this.match("TK_Numero");
        } else if(this.tokenActual.getDescripcion == 'TK_Caracter') {
            this.match("TK_Caracter");
        } else if(this.tokenActual.getDescripcion == 'TK_null') {
            this.match("TK_null");
        }
    }

    /**
     * OTRO CASE
     */
    private otroCase() {
        if(this.tokenActual != null) {
            if(this.tokenActual.getDescripcion == 'TK_case') {
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

    /**
     * DECLARACION BREAK
     */
    private declaracionBreak() {
        if(this.esSwitchRepeticion != 0) {
            if(this.tokenActual.getDescripcion != null) {
                this.match("TK_break");
                this.match("S_Punto_Coma");
                this.declaracionLista();
            }
        }
    }

    /**
     * DECLARACION CONTINUE
     */
    private declaracionContinue() {
        if(this.esRepeticion != 0) {
            if(this.tokenActual.getDescripcion != null) {
                this.match("TK_continue");
                this.match("S_Punto_Coma");
                this.declaracionLista();
            }
        }
    }

    /**
     * DECLARACION DEFAULT
     */
    private declaracionDefault() {
        if(this.tokenActual != null) {
            if(this.tokenActual.getDescripcion == 'TK_default') {
                this.match("TK_default");
                this.match("S_Dos_Puntos");
                this.declaracionComentario();
                this.declaracionLista();
                this.declaracionComentario();
            } else {
                //EPSILON
            }
        }
    }

        /**
     * DECLARACION DO WHILE
     */
    private declaracionDoWhile() {
        this.esSwitchRepeticion++;
        this.esRepeticion++;
        this.match("TK_do");
        this.match("S_Llave_Izquierda");
        this.declaracionComentario();
        this.declaracionLista();
        this.declaracionComentario();
        this.match("S_Llave_Derecha");
        this.match("TK_while");
        this.match("S_Parentesis_Izquierda");
        this.condiciones();
        this.match("S_Parentesis_Derecha");
        this.match("S_Punto_Coma");
        this.esSwitchRepeticion--;
        this.esRepeticion--;
        this.declaracionComentario();
        this.declaracionLista();
        this.declaracionComentario();
    }

    /**
     * OPEARCION RELACIONAL
     */
    private operacionRelacional() {
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
        } if(this.tokenActual.getDescripcion == "S_Igual") {
            this.match("S_Igual");
            this.match("S_Igual");
        } if(this.tokenActual.getDescripcion == "S_Exclamacion") {
            this.match("S_Exclamacion");
            this.match("S_Igual");
        } 
    }

    /**
     * OPEARCION LOGICO
     */
    private operacionLogicoAndOr() {
        if(this.tokenActual.getDescripcion == "S_Pleca") {
            this.match("S_Pleca");
            this.match("S_Pleca");
        } else if(this.tokenActual.getDescripcion == "S_Ampersand") {
            this.match("S_Ampersand");
            this.match("S_Ampersand");
        }
    }

    /**
     * OPEARCION LOGICO NOT
     */
    private operacionLogicoNot() {
        if(this.tokenActual.getDescripcion == "S_Exclamacion") {
            this.match("S_Exclamacion");
        } else {
            //EPSILON
        }
    }

    /**
     * DECLARACION SIN TIPO
     */
    private declaracionSinTipo() {
        this.match("TK_Identificador");
        this.match("S_Igual");
        this.expresion();
        this.match("S_Punto_Coma");
        this.declaracionComentario();
        this.declaracionLista();
        this.declaracionComentario();
    }

    /**
     * EXPRESION
     */
    private expresion() {
        this.termino();
        this.expresionPrima();
    }

    private termino() {
        this.factor();
        this.terminoPrima();
    }

    private expresionPrima() {
        if (this.tokenActual.lexema == "+")
        {
            this.match(this.tokenActual.getDescripcion);
            this.evaluarSiguiente(this.tokenActual.getDescripcion);
        }
        else if (this.tokenActual.lexema == "-")
        {
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

    private evaluarSiguiente(texto:string) {
        if (this.tokenActual.lexema != texto)
        {
            //console.error(this.tokenActual.lexema)
            this.termino();
            this.expresionPrima();
        } else {
            //console.error(texto)
        }
    }

    private factor() {
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
        || this.tokenActual.getDescripcion == ("TK_Numero")
        || this.tokenActual.getDescripcion == ("TK_Caracter")
        || this.tokenActual.getDescripcion == ("TK_true")
        || this.tokenActual.getDescripcion == ("TK_false"))
        {
            this.match(this.tokenActual.getDescripcion);
        } else if (this.tokenActual.getDescripcion == ("TK_Identificador"))
        {
            this.match(this.tokenActual.getDescripcion);
            this.valorMetodoGlobal();
        } else {
            console.error("Error se esperaba TK_Numero o TK_Cadena en lugar de " + this.tokenActual.getDescripcion);
        }
    }

    private terminoPrima() {
        if (this.tokenActual.lexema == "*")
        {
            this.match(this.tokenActual.getDescripcion);
            this.evaluarSiguiente(this.tokenActual.getDescripcion);
        }
        else if (this.tokenActual.lexema == "/")
        {
            this.match(this.tokenActual.getDescripcion);
            this.evaluarSiguiente(this.tokenActual.getDescripcion);
        }
        else
        {
            //EPSILON
        }
    }

    private listaParametroAsignacion() {
        this.expresion();
        this.masParametrosAsignacion();
    }

    private masParametrosAsignacion() {
        if(this.tokenActual.getDescripcion == "S_Coma") {
            this.match("S_Coma");
            this.listaParametroAsignacion();
        } else {
            //EPSILON
        }
    }

    /**
     * CONDICIONES
     */
    private condiciones() {
        if(this.tokenActual.getDescripcion != "S_Parentesis_Derecha") {
            this.expresion2();
            this.masCondiciones();
        }
    }

    private masCondiciones() {
        if(this.tokenActual.getDescripcion == "S_Pleca") {
            this.match("S_Pleca");
            this.match("S_Pleca");
        }if(this.tokenActual.getDescripcion == "S_Ampersand") {
            this.match("S_Ampersand");
            this.match("S_Ampersand");
        } else {
            //EPSILON
        }
        this.condiciones();
    }

    private expresion2() {
        this.termino2();
        this.expresionPrima2();
    }

    private termino2() {
        this.factor2();
        this.terminoPrima2();
    }

    private expresionPrima2() {
        if (this.tokenActual.getDescripcion != null)
        {
        if (this.tokenActual.lexema == "+")
        {
            this.match(this.tokenActual.getDescripcion);
            this.evaluarSiguiente2(this.tokenActual.getDescripcion);
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
                this.evaluarSiguiente2(this.tokenActual.getDescripcion);
            } else {
                //EPSILON
                this.evaluarSiguiente2(this.tokenActual.getDescripcion);
            }
        } else if(this.tokenActual.getDescripcion == "S_Mayor") {
            this.match("S_Mayor");
            this.tokenActual = this.arregloToken[this.indiceActual];
            if(this.tokenActual.getDescripcion == "S_Igual") {
                this.match("S_Igual");
                this.evaluarSiguiente2(this.tokenActual.getDescripcion);
            } else {
                //EPSILON
                this.evaluarSiguiente2(this.tokenActual.getDescripcion);
            }
        } else if(this.tokenActual.getDescripcion == "S_Igual") {
            this.match("S_Igual");
            this.match("S_Igual");
            this.evaluarSiguiente2(this.tokenActual.getDescripcion);
        } else if(this.tokenActual.getDescripcion == "S_Exclamacion") {
            this.match("S_Exclamacion");
            this.match("S_Igual");
            this.evaluarSiguiente2(this.tokenActual.getDescripcion);
        }
        else
        {
            //EPSILON
        }   
        }
    }

    private evaluarSiguiente2(texto:string) {
        if (this.tokenActual.lexema != texto)
        {
            //console.error(this.tokenActual.lexema)
            this.termino2();
            this.expresionPrima2();
        } else {
            //console.error(texto)
        }
    }

    private factor2() {
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
            || this.tokenActual.getDescripcion == ("TK_Numero")
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
                console.error("Error se esperaba TK_Numero o TK_Cadena en lugar de " + this.tokenActual.getDescripcion);
            }
        }
    }

    private terminoPrima2() {
        if(this.tokenActual.getDescripcion!=null) {
            if (this.tokenActual.lexema == "*")
            {
                this.match(this.tokenActual.getDescripcion);
                this.evaluarSiguiente2(this.tokenActual.getDescripcion);
            }
            else if (this.tokenActual.lexema == "/")
            {
                this.match(this.tokenActual.getDescripcion);
                this.evaluarSiguiente2(this.tokenActual.getDescripcion);
            }
            else
            {
                //EPSILON
                //console.error(this.tokenActual.lexema)
            }
        }
        
    }

    /**
     * CONDICIONES DE RETORNO
     */
    private condicionesReturn() {
        if(this.tokenActual.getDescripcion != "S_Punto_Coma") {
            this.expresion2();
            this.masCondicione3();
        }
    }

    private masCondicione3() {
        if(this.tokenActual.getDescripcion == "S_Pleca") {
            this.match("S_Pleca");
            this.match("S_Pleca");
        }if(this.tokenActual.getDescripcion == "S_Ampersand") {
            this.match("S_Ampersand");
            this.match("S_Ampersand");
        } else {
            //EPSILON
        }
        this.condicionesReturn();
    }

    private expresion3() {
        this.termino3();
        this.expresionPrima3();
    }

    private termino3() {
        this.factor3();
        this.terminoPrima3();
    }

    private expresionPrima3() {
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

    private evaluarSiguiente3(texto:string) {
        if (this.tokenActual.lexema != texto)
        {
            this.termino3();
            this.expresionPrima3();
        } else {
            //EPSILON
        }
    }

    private factor3() {
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
            || this.tokenActual.getDescripcion == ("TK_Numero")
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
                console.error("Error se esperaba TK_Numero o TK_Cadena en lugar de " + this.tokenActual.getDescripcion);
            }
        }
    }

    private terminoPrima3() {
        if(this.tokenActual.getDescripcion!=null) {
            if (this.tokenActual.lexema == "*")
            {
                this.match(this.tokenActual.getDescripcion);
                this.evaluarSiguiente3(this.tokenActual.getDescripcion);
            }
            else if (this.tokenActual.lexema == "/")
            {
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
    private match(token:string)
    {
        let validar:Boolean;
        if(this.tokenActual!=null){

            if (this.tokenActual.getDescripcion!=token)
            {
                console.error(">> Error Sintactico: Se esperaba " + token + " en lugar de " + this.tokenActual.getDescripcion +
                " en la Fila: " + this.tokenActual.fila + " y Columna: " +this.tokenActual.columna);
                
                for (let indiceActual = this.indiceActual; indiceActual < this.arregloToken.length; indiceActual++) {
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
                        validar = true;
                        break;
                    }
                    this.indiceActual += 1;
                }                
            }

            if (this.tokenActual.getDescripcion == token)
            {
                console.log(this.tokenActual.toString())
                this.indiceActual += 1;
                this.tokenActual = this.arregloToken[this.indiceActual];
            }
        }
    }

}