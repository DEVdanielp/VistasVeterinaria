var BaseURL = "https://localhost:44366/api/";
var oTabla = $("#tablaDatos").DataTable();
jQuery(function () {
    let URL = BaseURL + "Mascotas/LlenarCombo"
    let URL1 = BaseURL + "ProductoFarmacia/LlenarCombo"
    let URL2 = BaseURL + "Empleado/LlenarCombo"
    LlenarTablaPrescripcion();
    LlenarComboXServicios(URL, "#cboMascota");
    LlenarComboXServicios(URL1, "#cboMedicamento");
    LlenarComboXServicios(URL2, "#cboEmpleado");
});  

async function ObtenerMascota() {
    let URL = URLBase + "api/Especie/ConsultarXID?ID=" + cedula;

    try {
        const Mascotas = await ConsultarServicio(URL);

        contenedor.innerHTML = ""; // Limpia lo anterior

        Mascotas.forEach(mascota => {
            const fecha = new Date(mascota.FechaNacimiento);
            const tarjetaHTML = `
                <div class="pet-card">
                    <div class="pet-info">
                        <p><i class="fas fa-paw"></i><strong>Nombre:</strong> ${mascota.Nombre}</p>
                        <p><i class="fas fa-dog"></i><strong>Especie:</strong> ${mascota.NombreEspecie} - ${mascota.NombreRaza}</p>
                        <p><i class="fas fa-birthday-cake"></i><strong>Fecha de nacimiento:</strong> ${fecha.toLocaleDateString('es-CO')}</p>
                    </div>
                </div>
            `;
            contenedor.innerHTML += tarjetaHTML;
        });

    } catch (error) {
        console.error("Error al obtener usuario:", error);
    }
}
function LlenarTablaPrescripcion() {
    let URL = BaseURL + "Prescripcion/PrescripcionConMascota";
    LlenarTablaXServicios(URL, "#tblPrescripcion");
}
class Mascota {
    constructor(ID, Nombre, FechaNacimiento, Sexo, ID_Raza, ID_Propietario) {
        this.ID = ID;
        this.Nombre = Nombre;
        this.FechaNacimiento = FechaNacimiento;
        this.Sexo = Sexo;
        this.ID_Raza = ID_Raza;
        this.ID_Propietario = ID_Propietario;
    }
}
