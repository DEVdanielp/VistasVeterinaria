var URLBase = "http://proyectoveterinaria.runasp.net/";

// Función para obtener todos los clientes y mostrarlos en la tabla
async function ObtenerUsuario() {
    const cedula = getCookie("Documento"); // Solo si necesitas filtrar por cédula

    let URL = URLBase + "api/Propietarios/ConsultarTodos"; // Corrige concatenación

    try {
        const lista = await ConsultarServicio(URL); // Espera el listado del API

        $('#tablaClientes').html(''); // Limpia la tabla antes de insertar

        lista.forEach(cliente => {
            $('#tablaClientes').append(`
                <tr>
                    <td>${cliente.Cedula}</td>
                    <td>${cliente.Nombre}</td>
                    <td>${cliente.Direccion}</td>
                    <td>${cliente.Telefono}</td>
                    <td>${cliente.Correo}</td>
                    <td>
                        <button class="btn btn-info btn-sm" onclick="verMascotas(${cliente.IdPropietario}, '${cliente.Nombre}')">
                            <i class="fas fa-dog"></i> Ver Mascotas
                        </button>
                    </td>
                </tr>
            `);
        });
    } catch (error) {
        console.error("Error al obtener usuario:", error);
    }
}

// Llamar la función al cargar la página
window.addEventListener("load", ObtenerUsuario);
