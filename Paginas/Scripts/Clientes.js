const URLBase = "http://proyectoveterinaria.runasp.net/";
let lista = []; // Variable global para clientes

// Función para obtener todos los clientes y mostrarlos en la tabla
async function ObtenerUsuarios() {
    let URL = URLBase + "api/Propietarios/ConsultarTodos";

    try {
        lista = await ConsultarServicio(URL);

        $('#tablaClientes').html('');

        lista.forEach(cliente => {
            $('#tablaClientes').append(`
                <tr>
                    <td>${cliente.Cedula}</td>
                    <td>${cliente.Nombre}</td>
                    <td>${cliente.Direccion}</td>
                    <td>${cliente.Telefono}</td>
                    <td>${cliente.Correo}</td>
                    <td>
                        <button class="btn btn-info btn-sm me-2" onclick="verMascotas(${cliente.Cedula}, '${cliente.Nombre}')">
                            <i class="fas fa-dog"></i> Ver Mascotas
                        </button>
                        <button class="btn btn-success btn-sm" onclick="abrirRegistrarMascotaModal(${cliente.Cedula}, '${cliente.Nombre}')">
                            <i class="fas fa-plus"></i> Registrar Mascota
                        </button>
                    </td>
                </tr>
            `);
        });
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
    }
}

// Buscador de clientes
$('#buscadorClientes').on('input', function () {
    const termino = $(this).val().toLowerCase();

    const filtrados = lista.filter(c =>
        c.Nombre.toLowerCase().includes(termino) ||
        c.Correo.toLowerCase().includes(termino) ||
        c.Telefono.includes(termino)
    );

    $('#tablaClientes').html('');
    filtrados.forEach(cliente => {
        $('#tablaClientes').append(`
            <tr>
                <td>${cliente.Cedula}</td>
                <td>${cliente.Nombre}</td>
                <td>${cliente.Direccion}</td>
                <td>${cliente.Telefono}</td>
                <td>${cliente.Correo}</td>
                <td>
                    <button class="btn btn-info btn-sm me-2" onclick="verMascotas(${cliente.Cedula}, '${cliente.Nombre}')">
                        <i class="fas fa-dog"></i> Ver Mascotas
                    </button>
                    <button class="btn btn-success btn-sm" onclick="abrirRegistrarMascotaModal(${cliente.Cedula}, '${cliente.Nombre}')">
                        <i class="fas fa-plus"></i> Registrar Mascota
                    </button>
                </td>
            </tr>
        `);
    });
});

// Función para mostrar mascotas del cliente en modal
async function verMascotas(cedula, nombreCliente) {
    const mascotas = await ObtenerMascotaFiltro(cedula) || [];

    $('#modalMascotasLabel').text(`Mascotas de ${nombreCliente}`);
    $('#contenedorMascotas').html('');

    if (mascotas.length === 0) {
        $('#contenedorMascotas').html('<p class="text-muted">Este cliente no tiene mascotas registradas.</p>');
    } else {
        mascotas.forEach(mascota => {
            $('#contenedorMascotas').append(`
                <div class="pet-card">
                    <div>
                        <p><strong>Nombre:</strong> ${mascota.Nombre}</p>
                        <p><strong>Especie:</strong> ${mascota.NombreEspecie} - ${mascota.NombreRaza}</p>
                    </div>
                </div>
            `);
        });
    }

    const modal = new bootstrap.Modal(document.getElementById('modalMascotas'));
    modal.show();
}

// Abrir modal para registrar mascota
function abrirRegistrarMascotaModal(cedulaCliente, nombreCliente) {
    // Poner el id del cliente en un input oculto del formulario
    $('#clienteCedula').val(cedulaCliente);

    // Cambiar título del modal para que incluya nombre cliente
    $('#modalRegistrarMascotaLabel').text(`Registrar mascota para ${nombreCliente}`);

    // Limpiar formulario
    $('#formRegistrarMascota')[0].reset();

    // Llenar combo de razas (función externa)
    LlenarComboXServicios(URLBase + "api/Razas/ConsultarTodos", "#idRaza");

    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('modalRegistrarMascota'));
    modal.show();
}

// Función para registrar mascota
async function RegistrarMascota() {
    const mascota = {
        ID: parseInt(document.getElementById('idMascota').value),
        Nombre: document.getElementById('nombreMascota').value,
        FechaNacimiento: document.getElementById('fechaNacimiento').value,
        Sexo: document.getElementById('sexoMascota').value,
        Id_Raza: parseInt(document.getElementById('idRaza').value),
        ID_Propietario: parseInt(document.getElementById('clienteCedula').value)
    };

    try {
        await EjecutarComandoServicio("POST", URLBase + "api/Mascotas/Insertar", mascota);

        // Cerrar modal después de guardar
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalRegistrarMascota'));
        modal.hide();

        // Puedes recargar la lista o dar feedback si quieres
        alert("Mascota registrada correctamente.");

    } catch (error) {
        console.error("Error al registrar mascota:", error);
        alert("Error al registrar mascota.");
    }
}

// Evento submit para registrar cliente
document.getElementById("formRegistrarCliente").addEventListener("submit", function (event) {
    event.preventDefault();

    const cliente = {
        cedula: parseInt(document.getElementById("cedulaCliente").value),
        nombre: document.getElementById("nombreCliente").value,
        direccion: document.getElementById("direccionCliente").value,
        telefono: document.getElementById("telefonoCliente").value,
        correo: document.getElementById("correoCliente").value
    };

    EjecutarComandoServicioRpta("POST", URLBase + "api/Propietarios/Insertar", cliente)
        .then(() => {
            location.reload();
        })
        .catch(error => {
            console.error("Error al registrar cliente:", error);
            alert("Error al registrar cliente.");
        });
});

// Evento submit para registrar mascota
document.getElementById("formRegistrarMascota").addEventListener("submit", function (event) {
    event.preventDefault();
    RegistrarMascota();
});

async function ObtenerMascotaFiltro(cedula) {
    let URL = URLBase + "api/Mascotas/ConsultarPorPropietario?CedulaPropietario=" + cedula;
    const contenedor = document.getElementById("listaMascotas");

    try {
        const Mascotas = await ConsultarServicio(URL);
        return Mascotas

    } catch (error) {
        console.error("Error al obtener usuario:", error);
    }
}

// Ejecutar al cargar la página
window.addEventListener("load", ObtenerUsuarios);
