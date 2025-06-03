var URLBase = "http://proyectoveterinaria.runasp.net/";

async function ObtenerMascota() {
    const cedula = getCookie("Documento");
    let URL = URLBase + "api/Mascotas/ConsultarPorPropietario?CedulaPropietario=" + cedula;
    const contenedor = document.getElementById("listaMascotas");

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

async function ObtenerMascotaFiltro(cedula) {
    let URL = URLBase + "api/Mascotas/ConsultarPorPropietario?CedulaPropietario=" + cedula;
    const contenedor = document.getElementById("listaMascotas");

    try {
        const Mascotas = await ConsultarServicio(URL);
        return Mascotas

    } catch (error) {
        console.error("Error al obtener usuario:", error);
    }
}


window.addEventListener("load", ObtenerMascota);
