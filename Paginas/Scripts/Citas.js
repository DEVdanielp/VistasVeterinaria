var BaseURL = "https://localhost:44366/api/";
var oTabla = $("#tablaDatos").DataTable();
jQuery(function () {
    let URL = BaseURL + "Mascotas/LlenarCombo"
    let URL1 = BaseURL + "Sede/LlenarCombo"
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

function LlenarTablaCita() {
    let URL = BaseURL + "Citas/ObtenerCita";
    LlenarTablaXServicios(URL, "#tblChequeos");
}
Ejecu
class Cita {
    constructor(ID, ID_Mascota, ID_Empleado, ID_Sede, FechaHora, Estado, TipoCita) {
        this.ID = ID;
        this.ID_Mascota = ID_Mascota;
        this.ID_Empleado = ID_Empleado;
        this.ID_Sede = ID_Sede;
        this.FechaHora = FechaHora;
        this.Estado = Estado;
        this.TipoCita = TipoCita;
    }
}

async function RegistrarCita() {
    let URL = BaseURL + "Citas/Insertar";
    const cita = new Cita(
        $("#idCita").val(),
        $("#cboMascota").val(),
        $("#cboEmpleado").val(),
        $("#cboSede").val(),
        $("#FechaCita").val(),
        $("#EstadoCita").val(),
        $("#TipCita").val()
    );
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



