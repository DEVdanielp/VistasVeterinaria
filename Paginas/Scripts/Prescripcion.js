var dir = "https://localhost:44366/";
var oTabla = $("#tablaDatos").DataTable();
jQuery(function () {
    $("#btnGuardar").on("click", function () {
        alert("Agregar");
        //ejecutarComando("POST");
    });
    $("#btnEditar").on("click", function () {
        alert("Modificar");
        //ejecutarComando("PUT");
    });
    $("#btnBuscar").on("click", function () {
        alert("Buscar");
        //Consultar();
    });
    $("#btnCancelar").on("click", function () {
        alert("Cancelar");
        //Cancelar();
    });
    $("#tablaDatos tbody").on("click", "tr", function () {
        // Levanta el evento del click sobre la tabla
        if ($(this).hasClass('selected')) {
            // event.preventDefault();
            $(this).removeClass('selected');
        } else {
            oTabla.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            editarFila($(this).closest('tr'));
        }
    });
    llenarComboMascota();
    llenarComboMedicamento();

    llenarTabla();
});  
function mensajeError(texto) {
    $("#dvMensaje").removeClass("alert alert-success");
    $("#dvMensaje").addClass("alert alert-danger");
    $("#dvMensaje").html(texto);
}
function mensajeInfo(texto) {
    $("#dvMensaje").removeClass("alert alert-success");
    $("#dvMensaje").addClass("alert alert-info");
    $("#dvMensaje").html(texto);
}
function mensajeOk(texto) {
    $("#dvMensaje").removeClass("alert alert-success");
    $("#dvMensaje").addClass("alert alert-success");
    $("#dvMensaje").html(texto);
}
function editarFila(datosFila) {
    event.preventDefault();

    // Seleccionar Combos
    let idMasc = datosFila.find('td:eq()').text();
    $("#cboMascota").val(idMasc);

    let idGe = datosFila.find('td:eq(6)').text();
    $("#cboGenero").val(idGe);

    let idDe = datosFila.find('td:eq(8)').text();
    $("#cboDpto").val(idDe);

    let idCi = datosFila.find('td:eq(10)').text();
    llenarComboCiudad(idCi);  // Llenar las ciudades acorde al Dpto

    $("#txtCodigo").val(datosFila.find('td:eq(1)').text());
    $("#txtNombre").val(datosFila.find('td:eq(2)').text());
    $("#txtNroDoc").val(datosFila.find('td:eq(5)').text());

    mensajeOk("Ok");
}
async function llenarComboGenero() {
    let url = dir + 'genero';
    let rpta = await llenarComboGral(url, '#cboGenero');
};
async function llenarComboTipoDoc() {
    let url = dir + 'tipoDoc';
    let rpta = await llenarComboGral(url, '#cboTipDoc');
};
async function ejecutarComando(accion) {
    //Capturar los datos de entrada
    let _vr1 = $("#txtXXX").val();
    let _vr2 = $("#cboXXX").val();
    let _vr3 = $("#txtXXX").val();

    let _vr4 = $("#chkXXX").prop("checked");
    _vr4 = (_vr4 == true) ? 1 : 0;

    //Json es un lenguaje que permite gestionar datos con 
    //formato de estructursa: Clave - Valor, y que puede contener 
    //estructuras complejas dentro de sus valores
    //Nombre: Valor
    let datosOut = {
        campo1: _vr1,
        campo2: _vr2,
        campo3: _vr3,
        campo4: _vr4
    }
    //Invocar el servicio con fetch
    try {
        const response = await fetch(dir + "nombre servicio", {
            method: accion,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datosOut),
        });   // stringify() convierte un objeto o valor de JavaScript en una cadena de texto JSON

        const Respuesta = await response.json();
        MensajeOk(Respuesta);

    } catch (error) {
        MensajeError("Error: ", error);
    }
}


async function llenarTabla(accion) {
    let url = dir + "artista?dato=0&comando=1";
    let rpta = await llenarTablaGral(url, "#tablaDatos")  // no encuentra la function tabla

    //let rpta = await llenarTablaGral(dir + "artista?dato=0&comando=1", "#tablaDatos");
}