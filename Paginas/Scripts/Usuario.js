var URLBase = "http://proyectoveterinaria.runasp.net/";

async function ObtenerUsuario() {
    const cedula = getCookie("Documento");
    let URL = URLBase + "api/Propietarios/ConsultarXDocumento?Cedula=" + cedula;

    try {
        // Recuerda usar await para esperar la respuesta async
        const User = await ConsultarServicio(URL);
        nombreUsuario.innerText = User.Nombre;
        correoUsuario.innerText = User.Correo;
        DireccionUsuario.innerText = User.Direccion;
        TelefonoUsuario.innerText = User.Telefono;

        // Aquí puedes hacer algo con User, como mostrarlo en la interfaz
    } catch (error) {
        console.error("Error al obtener usuario:", error);
    }
}

window.addEventListener("load", ObtenerUsuario);