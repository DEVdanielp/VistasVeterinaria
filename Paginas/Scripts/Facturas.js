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
    LlenarComboXServicios(URLBase + "api/Combos/LlenarComboCirugia", "#cirugia");
    LlenarComboXServicios(URLBase + "api/Combos/LlenarComboCita", "#cita");
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("formNuevaFactura").addEventListener("submit", async function (e) {
        e.preventDefault();

        const factura = {
            ID: parseInt(document.getElementById('idFactura').value),
            ID_Cliente: document.getElementById('clienteFactura').value,
            Fecha: new Date().toISOString(),
            Total: 0
        };

        try {
            await EjecutarComandoServicioRpta("POST", URLBase + "api/Factura/Insertar", factura);
            this.reset();

            const modalEl = document.getElementById('modalNuevaFactura');
            let modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
            modal.hide();

            location.reload();
        } catch (error) {
            console.error("Error al guardar factura:", error);
            alert("Error al guardar factura, revise la consola.");
        }
    });

    async function ObtenerTotalFactura(idFactura) {
        try {
            const detalles = await ConsultarServicio(URLBase + "api/FacturaDetalle/ConsultarXFactura?ID=" + idFactura);
            console.log(JSON.stringify(detalles))
            let total = 0;
            detalles.forEach(detalle => {
                total += detalle.PrecioUnitario ?? 0;
            });
            return total;
        } catch (error) {
            console.error("Error al obtener detalles de factura:", error);
            return 0;
        }
    }

    document.getElementById("formAgregarDetalle").addEventListener("submit", async function (e) {
        e.preventDefault();

        const idFactura = parseInt(document.getElementById('idFacturaModal').value);
        const detallefactura = {
            ID: parseInt(document.getElementById('idDetalle').value),
            ID_Factura: idFactura,
            ID_Cirugia: parseInt(document.getElementById('cirugia').value),
            ID_Hospitalizacion: parseInt(document.getElementById('cita').value),
            PrecioUnitario: 1000,
            ID_ProductoFarmacia: null,
            ID_ServicioAdicional: null,
        };

        try {
            await EjecutarComandoServicioRpta("POST", URLBase + "api/FacturaDetalle/Insertar", detallefactura);

            const factura = await ConsultarServicio(URLBase + "api/Factura/ConsultarXId?Id=" + idFactura);
            console.log("Se ha actualizado la factura con un precio de " + idFactura)
            const nuevoTotal = await ObtenerTotalFactura(idFactura);

            const facturaActualizar = {
                ID: idFactura,
                ID_Cliente: factura.ID_Cliente,
                Fecha: factura.Fecha,
                Total: nuevoTotal
            };

            await EjecutarComandoServicioRpta("PUT", URLBase + "api/Factura/Actualizar", facturaActualizar);
            console.log("Se ha actualizado la factura con un precio de " + nuevoTotal)

            this.reset();
            const modalDetalle = bootstrap.Modal.getInstance(document.getElementById("modalAgregarDetalle"));
            if (modalDetalle) modalDetalle.hide();

            await ObtenerFacturas(); // Recarga la tabla con el nuevo total
        } catch (error) {
            console.error("Error al agregar detalle o actualizar total:", error);
        }
    });

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
