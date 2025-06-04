var BaseURL = "http://proyectoveterinaria.runasp.net/";
var oTabla = $("#tablaDatos").DataTable();

jQuery(function () {
    let URL = BaseURL + "api/Mascotas/LlenarCombo";
    let URL1 = BaseURL + "api/ProductoFarmacia/LlenarCombo";
    let URL2 = BaseURL + "api/Empleado/LlenarCombo";

    LlenarTablaPrescripcion();
    LlenarComboXServicios(URL, "#cboMascota");
    LlenarComboXServicios(URL1, "#cboMedicamento");
    LlenarComboXServicios(URL2, "#cboEmpleado");
    const hoy = new Date().toISOString().split("T")[0];
    document.getElementById("fechaPrescripcion").setAttribute("min", hoy);
    document.getElementById("fechaPrescripcion").setAttribute("max", hoy);
    document.getElementById("fechaPrescripcion").value = hoy; // Opcional: establece valor por defecto

    // Ejecutar la función al cambiar selección de mascota
    $("#cboMascota").change(function () {
        let idMascota = $(this).val();
        ObtenerMascotaPorID(idMascota);
    });
});

function LlenarTablaPrescripcion() {
    let URL = BaseURL + "api/Prescripcion/PrescripcionConMascota";
    LlenarTablaXServicios(URL, "#tblPrescripcion");
}

async function ObtenerMascotaPorID(idMascota) {
    let URLMascota = BaseURL + "api/Mascotas/ConsultarXID?ID=" + idMascota;

    try {
        const mascota = await ConsultarServicio(URLMascota);

        if (mascota) {

            let idPropietario = mascota.ID_Propietario;
            let URLPropietario = BaseURL + "api/Propietarios/ConsultarXDocumento?Cedula=" + idPropietario
            const propietario = await ConsultarServicio(URLPropietario);
            if (propietario) {
                document.getElementById("txtPropietario").value = propietario.Nombre;
            }
            else {
                document.getElementById("txtPropietario").value = "Tiene un error madre ja";
            }

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
}


document.getElementById("btnGuardar").addEventListener("click", async function (event) {
    event.preventDefault(); // Evita comportamiento por defecto si está dentro de un formulario

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
        location.reload(); // Recarga la página
    } catch (error) {
        console.error("Error al registrar la prescripción:", error);
    }
});

