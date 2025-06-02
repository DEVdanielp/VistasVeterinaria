    var URLBase = "http://proyectoveterinaria.runasp.net/";
    async function Ingresar(){
        let URL = URLBase + "api/Login/Ingresar";
        const login = new Login($("#txtUsuario").val(), $("#txtClave").val());
        const Respuesta = await EjecutarComandoServicioRpta("POST", URL, login);
        if (Respuesta == null || Respuesta == undefined) {
            document.cookie = "token=0;path=/";
            //Hubo un error al procesar el comando
            $("#dvMensaje").removeClass("alert alert-success");
            $("#dvMensaje").addClass("alert alert-danger");
            $("#dvMensaje").html("No se pudo conectar con el servicio");
        }
        else {
            if (Respuesta.Autenticado = false) {
                $("#dvMensaje").removeClass("alert alert-success");
                $("#dvMensaje").addClass("alert alert-danger");
                $("#dvMensaje").html(Respuesta[0].Mensaje);
            } else {
                const extdays = 0.1;
                const d = new Date();
                d.setTime(d.getTime() + (extdays * 24 * 60 * 60 * 1000));
                let expires = ";expires=" + d.toUTCString();
                document.cookie = "token=" + Respuesta[0].Token + expires + ";path=/";
                $("#dvMensaje").removeClass("alert alert-danger");
                $("#dvMensaje").addClass("alert alert-success");
                $("#dvMensaje").html(Respuesta[0].Mensaje);
                document.cookie = "Perfil=" + Respuesta[0].Perfil;
                document.cookie = "Usuario=" + Respuesta[0].Usuario;
                window.location.href = Respuesta[0].PaginaInicio;
            }
        }

    }

    class Login {
        constructor(Usuario, Clave) {
            this.Usuario = Usuario;
            this.Clave = Clave;
        }
    }