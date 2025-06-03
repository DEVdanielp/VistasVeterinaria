var BaseURL = "https://localhost:44366/api/";
var oTabla = $("#tablaDatos").DataTable();
jQuery(function () {
    let URL = BaseURL + "Mascotas/LlenarCombo"
    LlenarTablaPrescripcion();
    LlenarComboXServicios(URL, "#cboMascota");
});  

function LlenarTablaPrescripcion() {
    let URL = BaseURL + "Prescripcion/PrescripcionConMascota";
    LlenarTablaXServiciosAuth(URL, "#tblPrescripcion");
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
