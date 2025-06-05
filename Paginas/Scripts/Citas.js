var BaseURL = "http://proyectoveterinaria.runasp.net/api/";
var oTabla = $("#tablaDatos").DataTable();
jQuery(function () {
    let URL = BaseURL + "Mascotas/LlenarCombo"
    let URL1 = BaseURL + "Sedes/LlenarCombo"
    let URL2 = BaseURL + "Empleado/LlenarCombo"
    LlenarTablaCita();
    LlenarComboXServicios(URL, "#cboMascota");
    LlenarComboXServicios(URL1, "#cboSede");
    LlenarComboXServicios(URL2, "#cboEmpleado");

    $("#btnGuardarCita").on("click", async function () {
        await RegistrarCita();
    });

    $("#btnBuscarCita").on("click", async function () {
        await BuscarCita();
    });

    $("#btnEditarCita").on("click", async function () {
        await ActualizarCita();
    });

    $("#btnEliminarCita").on("click", async function () {
        await EliminarCita();
    });

});

async function LlenarTablaCita() {
    let URL = BaseURL + "Citas/ConsultarTodos";

    try {
        lista = await ConsultarServicio(URL);

        $('#tblChequeos').html('');
        
        lista.forEach(cita => {
            $('#tblChequeos').append(`
                <tr>
                    <td>${cita.ID}</td>
                    <td>${cita.MascotaN}</td>
                    <td>${cita.EmpleadoN}</td>
                    <td>${cita.SedeN}</td>
                    <td>${cita.FechaHora}</td>
                    <td>${cita.TipoCita}</td>
                </tr>
            `);

            console.log(JSON.stringify(cita))

        });
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
    }
}


async function RegistrarCita() {
    let URL = BaseURL + "Citas/Insertar";
    const cita = {
        ID: parseInt($("#idCita").val()),
        ID_Mascota: parseInt($("#cboMascota").val()),
        ID_Empleado: parseInt($("#cboEmpleado").val()),
        ID_Sede: parseInt($("#cboSede").val()),
        FechaHora: $("#FechaCita").val(),
        Estado: $("#EstadoCita").val(),
        TipoCita: $("#TipCita").val()
    };
    console.log(cita);
    const Rpta = await EjecutarComandoServicioRptaAuth("POST", URL, cita);
    LlenarTablaCita();
}

async function BuscarCita() {
    let URL = BaseURL + "Citas/ConsultarXID?ID=" + $("#idCita").val();
    const cita = await ConsultarServicioAuth(URL);
    if (cita == null) {
        alert("Cita no encontrada");
        return;
    }
    $("#cboMascota").val(cita.ID_Mascota);
    $("#cboEmpleado").val(cita.ID_Empleado);
    $("#cboSede").val(cita.ID_Sede);
    $("#FechaCita").val(cita.FechaHora);
    $("#EstadoCita").val(cita.Estado);
    $("#TipCita").val(cita.TipoCita);
}

async function EliminarCita() {
    let URL = BaseURL + "Citas/EliminarXID?ID=" + $("#idCita").val();
    const Rpta = await EjecutarComandoServicioRptaAuth("DELETE", URL, null);
    LlenarTablaCita();
}

async function ActualizarCita() {
    let URL = BaseURL + "Citas/Actualizar";
    const cita = new Cita(
        $("#idCita").val(),
        $("#cboMascota").val(),
        $("#cboEmpleado").val(),
        $("#cboSede").val(),
        $("#FechaCita").val(),
        $("#EstadoCita").val(),
        $("#TipCita").val()
    );
    const Rpta = await EjecutarComandoServicioRptaAuth("PUT", URL, cita);
    LlenarTablaCita();
}

window.addEventListener("load", LlenarTablaCita);

