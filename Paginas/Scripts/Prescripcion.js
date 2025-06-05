var BaseURL = "http://proyectoveterinaria.runasp.net/";
var BaseURL1 = "http://proyectoveterinaria.runasp.net/";
var oTabla = $("#tablaDatos").DataTable();

jQuery(function () {
    let URL = BaseURL + "api/Propietarios/LlenarCombo";
    let URL1 = BaseURL + "api/ProductoFarmacia/LlenarCombo";
    let URL2 = BaseURL + "api/Empleado/LlenarCombo";

    LlenarTablaPrescripcion();
    LlenarComboXServicios(URL, "#cboPropietario");
    LlenarComboXServicios(URL1, "#cboMedicamento");
    LlenarComboXServicios(URL2, "#cboEmpleado");
    $("#cboPropietario").change(function () {
        let idPropietario = $(this).val();
        let URL3 = BaseURL + "api/Mascotas/LlenarComboPorPropietario?cedulaPropietario=" + idPropietario;
        LlenarComboXServicios(URL3, "#cboMascotas");
    });
    $("#cboMascotas").change(async function () {
        let idMascotas = $(this).val();
        let URL4 = BaseURL + "api/Mascotas/ConsultarXID?ID=" + idMascotas;

        try {
            // Consultar la mascota
            const mascota = await ConsultarServicio(URL4);

            if (mascota) {
                // Obtener raza
                let idRaza = mascota.ID_Raza;
                let URLRaza = BaseURL + "api/Razas/ConsultarXNit?id=" + idRaza;
                const raza = await ConsultarServicio(URLRaza);

                if (raza) {
                    document.getElementById("txtRaza").value = raza.Nombre;

                    // Obtener especie
                    let idEspecie = raza.ID_Especie;
                    let URLEspecie = BaseURL + "api/Especies/ConsultarXID?ID=" + idEspecie;
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
        document.getElementById("btnLimpiar").addEventListener("click", function () {
            LimpiarCampos();
        });

    });


    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    const fechaLocal = `${yyyy}-${mm}-${dd}`;

    document.getElementById("fechaPrescripcion").setAttribute("min", fechaLocal);
    document.getElementById("fechaPrescripcion").setAttribute("max", fechaLocal);
    document.getElementById("fechaPrescripcion").value = fechaLocal;

});

function LlenarTablaPrescripcion() {
    let URL = BaseURL + "api/Prescripcion/PrescripcionConMascota";
    LlenarTablaXServicios(URL, "#tblPrescripcion");
}
document.getElementById("btnGuardar").addEventListener("click", async function (event) {
    event.preventDefault();

    const Prescripcion = {
        Id_Paciente: document.getElementById('cboMascota').value,
        Id_Medicamento: document.getElementById('cboMedicamento').value,
        Id_Medico: parseInt(document.getElementById('cboEmpleado').value),
        Fecha_Prescripcion: document.getElementById('fechaPrescripcion').value,
        Cantidad: parseInt(document.getElementById('Cantidad').value)
    };

    console.log("Datos a enviar a la API:", Prescripcion);
    console.log("Iniciando");

    try {
        await EjecutarComandoServicio("POST", BaseURL + "api/Prescripcion/Insertar", Prescripcion);
        console.log("Registro exitoso");
        location.reload(); // Recargar la pagina
    } catch (error) {
        console.error("Error al registrar la prescripción:", error);
    }
});


function LimpiarCampos() {
    // Limpiar select
    $('#cboPropietario').val('');
    $('#cboMascotas').val('');
    $('#cboMedicamento').val('');
    $('#cboEmpleado').val('');

    // Limpiar inputs de texto
    $('#txtRaza').val('');
    $('#txtEspecie').val('');
    $('#Cantidad').val('');

    // Limpiar fecha (si quieres restaurarla al día actual)
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    const fechaLocal = `${yyyy}-${mm}-${dd}`;
    $('#fechaPrescripcion').val(fechaLocal);
}

