var BaseURL = "https://localhost:44366/api/";
var oTabla = $("#tablaDatos").DataTable();

jQuery(function () {
    let URL = BaseURL + "Mascotas/LlenarCombo";
    let URL1 = BaseURL + "ProductoFarmacia/LlenarCombo";
    let URL2 = BaseURL + "Empleado/LlenarCombo";

    LlenarTablaPrescripcion();
    LlenarComboXServicios(URL, "#cboMascota");
    LlenarComboXServicios(URL1, "#cboMedicamento");
    LlenarComboXServicios(URL2, "#cboEmpleado");

    // Ejecutar la función al cambiar selección de mascota
    $("#cboMascota").change(function () {
        let idMascota = $(this).val();
        ObtenerMascotaPorID(idMascota);
    });
});

function LlenarTablaPrescripcion() {
    let URL = BaseURL + "Prescripcion/PrescripcionConMascota";
    LlenarTablaXServicios(URL, "#tblPrescripcion");
}

async function ObtenerMascotaPorID(idMascota) {
    let URLMascota = BaseURL + "Mascotas/ConsultarXID?ID=" + idMascota;

    try {
        const mascota = await ConsultarServicio(URLMascota);

        if (mascota) {
            let idRaza = mascota.ID_Raza;
            let URLRaza = BaseURL + "Razas/ConsultarXNit?id=" + idRaza;
            const raza = await ConsultarServicio(URLRaza);
            if (raza) {
                document.getElementById("txtRaza").value = raza.Nombre;

                // Obtener especie
                let idEspecie = raza.ID_Especie;
                let URLEspecie = BaseURL + "Especies/ConsultarXID?ID=" + idEspecie;
                const especie = await ConsultarServicio(URLEspecie);

                if (especie) {
                    document.getElementById("txtEspecie").value = especie.Nombre;
                } else {
                    document.getElementById("txtEspecie").value = "Especie no encontrada";
                }

            } else {
                document.getElementById("txtRaza").value = "Raza no encontrada";
                document.getElementById("txtEspecie").value = "";
            }

        } else {
            document.getElementById("txtRaza").value = "Mascota no encontrada";
            document.getElementById("txtEspecie").value = "";
        }

    } catch (error) {
        console.error("Error al obtener la mascota, raza o especie:", error);
        document.getElementById("txtRaza").value = "Error";
        document.getElementById("txtEspecie").value = "Error";
    }
}


async function RegistrarPrescripcion() {
    const Prescripcion = {
        Id_Paciente: document.getElementById('cboMascota').value,
        Id_Medicamento: document.getElementById('cboMedicamento').value,
        Id_Medico: parseInt(document.getElementById('cboEmpleado').value),
        Fecha_Prescripcion: document.getElementById('fechaPrescripcion').value, // como string
        Cantidad: parseInt(document.getElementById('Cantidad').value)
    };

    await EjecutarComandoServicio("POST", BaseURL + "Prescripcion/Insertar", Prescripcion);


    const modalEl = document.getElementById('btnGuardar');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
}
