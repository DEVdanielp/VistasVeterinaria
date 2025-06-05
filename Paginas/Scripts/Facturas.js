var URLBase = "http://proyectoveterinaria.runasp.net/";

async function ObtenerFacturas() {
    let URL = URLBase + "api/Factura/ConsultarTodos";

    try {
        let lista = await ConsultarServicio(URL);
        console.log(JSON.stringify(lista));
        $('#tablaFacturas').html('');

        lista.forEach(factura => {
            const fecha = new Date(factura.Fecha);
            const dia = String(fecha.getDate()).padStart(2, '0');
            const mes = String(fecha.getMonth() + 1).padStart(2, '0');
            const anio = fecha.getFullYear();
            const fechaFormateada = `${dia}/${mes}/${anio}`;

            $('#tablaFacturas').append(`
                <tr>
                    <td>${factura.ID}</td>
                    <td>${fechaFormateada}</td>
                    <td>${factura.NombreCliente}</td>
                    <td>${factura.Total}</td>
                    <td>
                        <button
                            class="btn btn-sm btn-info btn-ver-detalles"
                            data-bs-toggle="modal"
                            data-bs-target="#modalDetallesFactura"
                            data-idfactura="${factura.ID}">
                            <i class="fas fa-eye"></i> Ver Detalles
                        </button>
                    </td>
                </tr>
            `);
        });
    } catch (error) {
        console.error("Error al obtener facturas:", error);
    }
}

async function llenarCombo() {
    LlenarComboXServicios(URLBase + "api/Propietarios/LlenarCombo", "#clienteFactura");
    LlenarComboXServicios(URLBase + "api/ProductoFarmacia/LlenarCombo", "#selectServicio");
}

    const modalDetalles = document.getElementById('modalDetallesFactura');
    modalDetalles.addEventListener('show.bs.modal', async function (event) {
        const button = event.relatedTarget;
        const idFactura = button.getAttribute('data-idfactura');

        document.getElementById('idFacturaModal').value = idFactura;
        modalDetalles.querySelector('.modal-body p').textContent = `Detalles de la factura con ID: ${idFactura}`;

        const total = await ObtenerTotalFactura(idFactura);
        document.getElementById('totalFacturaModal').textContent = `Total: $${total}`;
    });
});

window.addEventListener("load", ObtenerFacturas);
window.addEventListener("load", llenarCombo);
