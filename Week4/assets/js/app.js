// =========================================================================
// [TASK 1]: CONFIGURACIÓN GENERAL, DECLARACIÓN DE VARIABLES E INICIALIZACIÓN
// =========================================================================

// Dirección de la API (URL base de tu JSON Server en el puerto 3002)
const API_URL = "http://localhost:3002/productos"; 

// Arreglo global que gestiona el estado temporal de los productos en la SPA
let infoProductos = [];

// Variable global de control para almacenar el ID del producto que se va a editar
let idProductoA_Editar = null;

// [TASK 1]: CAPTURA DE NODOS ELEMENTALES DEL DOM (Referencias a los botones)
const formulario = document.getElementById("formulario-producto");
const listaDOM = document.getElementById("lista-productos");
const feedback = document.getElementById("contenedor-mensaje");
const btnSincronizar = document.getElementById("btn-sincronizar");
const btnMostrarAPI = document.getElementById("btn-mostrar-api");
const btnVaciarAPI = document.getElementById("btn-vaciar-api");

// [TASK 1]: CAPTURA DE INPUTS DEL FORMULARIO
const inputNombre = document.getElementById("nombre");
const inputPrecio = document.getElementById("precio");
const inputCantidad = document.getElementById("cantidad");

// [TASK 4]: PERSISTENCIA LOCAL - Inicialización y carga de caché (LocalStorage)
document.addEventListener("DOMContentLoaded", () => {
    const datosGuardados = localStorage.getItem("productos_local");
    if (datosGuardados) {
        // Convierte el texto JSON de vuelta a un arreglo manipulable
        infoProductos = JSON.parse(datosGuardados);
        renderizarLista();
    }
});

// =========================================================================
// [TASK 2]: CAPTURA DE DATOS DEL FORMULARIO Y VALIDACIÓN DE ENTRADAS
// =========================================================================

// Escuchador del formulario (Se dispara al presionar el botón de guardar o actualizar)
formulario.addEventListener("submit", async (evento) => {
    // REQUISITO SPA CRUCIAL: Detiene la recarga automática de la página web
    evento.preventDefault(); 

    // Obtención de valores limpiando espacios en blanco externos
    const nombre = inputNombre.value.trim();
    const precio = inputPrecio.value.trim();
    const cantidad = inputCantidad.value.trim();

    // [TASK 2]: Validación A - Impedir registros con campos en blanco
    if (nombre === "" || precio === "" || cantidad === "") {
        mostrarFeedback("Todos los campos son obligatorios", "error");
        return; 
    }

    // [TASK 2]: Validación B - Comprobación de números mayores a cero
    if (parseFloat(precio) <= 0 || parseInt(cantidad) <= 0) {
        mostrarFeedback("El precio y la cantidad deben ser mayores a cero", "error");
        return;
    }

    // [NUEVA REQUISICIÓN - MÉTODO PUT]: Lógica de Actualización en el Servidor
    if (idProductoA_Editar !== null) {
        mostrarFeedback("Actualizando producto en el servidor remoto...", "exito");
        
        const productoActualizado = {
            id: idProductoA_Editar.toString(),
            nombre: nombre,
            precio: parseFloat(precio).toFixed(2),
            cantidad: parseInt(cantidad)
        };

        try {
            // Envío HTTP PUT hacia la URL exacta del recurso (ej: /productos/1)
            const respuesta = await fetch(`${API_URL}/${idProductoA_Editar}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productoActualizado)
            });

            if (!respuesta.ok) throw new Error("Error en la actualización PUT");

            mostrarFeedback(`¡Producto ID ${idProductoA_Editar} actualizado con éxito!`, "exito");
            
            // Reestablecemos el botón del formulario a su estado original de guardado
            const btnGuardar = formulario.querySelector("button[type='submit']");
            btnGuardar.textContent = "Guardar Producto";
            btnGuardar.style.backgroundColor = "#2563eb";
            
            idProductoA_Editar = null;
            formulario.reset();
            btnMostrarAPI.click(); // Fuerza una recarga automática de la lista en pantalla

        } catch (error) {
            console.error("Error en PUT:", error);
            mostrarFeedback("No se pudo actualizar en el servidor", "error");
        }
        return; // Interrumpe el flujo para evitar que lo duplique abajo como local
    }

    // [TASK 2]: Estructuración del objeto producto con ID temporal por tiempo
    const nuevoProducto = {
        id: Date.now().toString(), 
        nombre: nombre,
        precio: parseFloat(precio).toFixed(2), 
        cantidad: parseInt(cantidad)
    };

    // [TASK 4]: Guardado local (Guarda en memoria y actualiza LocalStorage)
    infoProductos.push(nuevoProducto);
    guardarEnLocalStorage();
    renderizarLista();
    
    formulario.reset();
    mostrarFeedback("Producto agregado localmente con éxito", "exito");
});



// =========================================================================
// [TASK 3]: MANIPULACIÓN DINÁMICA DEL DOM (Lista Local)
// =========================================================================

// Función encargada de pintar en pantalla los productos almacenados localmente
function renderizarLista() {
    listaDOM.innerHTML = ""; // Limpieza total para evitar duplicidad de elementos visuales

    infoProductos.forEach((producto) => {
        // Creación del nodo de lista LI
        const li = document.createElement("li");
        li.textContent = `${producto.nombre} - $${producto.precio} (Cant: ${producto.cantidad}) `;

        // Creación del botón para eliminar localmente
        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        
        // Evento asignado de forma dinámica al elemento iterado
        botonEliminar.addEventListener("click", () => {
            eliminarProducto(producto.id);
        });

        // Ensamblado jerárquico de componentes
        li.appendChild(botonEliminar);
        listaDOM.appendChild(li);
    });
}

// Remueve el objeto del arreglo lógico y actualiza la interfaz
function eliminarProducto(id) {
    infoProductos = infoProductos.filter(prod => prod.id !== id);
    guardarEnLocalStorage();
    renderizarLista();
    mostrarFeedback("Producto eliminado correctamente", "error");
}


// =========================================================================
// [TASK 5]: CONSUMO DE APIS E INTEGRACIÓN DE OPERACIONES ASÍNCRONAS (Fetch)
// =========================================================================

// Botón Sincronizar: Envía datos locales a la base de datos evitando repetidos e IDs extraños
btnSincronizar.addEventListener("click", async () => {
    if (infoProductos.length === 0) {
        mostrarFeedback("No hay productos locales para sincronizar", "error");
        return;
    }

    mostrarFeedback("Sincronizando de forma correlativa con el servidor...", "exito");

    try {
        // [TASK 5 - GET]: Leemos el servidor antes de proceder
        const respuesta = await fetch(API_URL);
        const productosEnAPI = await respuesta.json();

        // [NUEVA REQUISICIÓN]: Calculamos el ID numérico más alto en el servidor para evitar textos raros
        let ultimoIdNumerico = productosEnAPI.reduce((max, prod) => {
            const idActual = parseInt(prod.id);
            return !isNaN(idActual) && idActual > max ? idActual : max;
        }, 0);

        for (const productoLocal of infoProductos) {
            // [TASK 5 - CONDICIÓN]: Validamos que el nombre no exista en la API
            const existeDuplicado = productosEnAPI.some(
                prodAPI => prodAPI.nombre.toLowerCase() === productoLocal.nombre.toLowerCase()
            );

            if (existeDuplicado) {
                mostrarFeedback(`El producto "${productoLocal.nombre}" ya existe en el servidor`, "error");
                continue; // Pasa al siguiente elemento sin romper el bucle
            }

            // Clonación de seguridad para formatear las propiedades
            const productoListo = JSON.parse(JSON.stringify(productoLocal));
            
            // Forzamos el ID correlativo numérico entero puro de tipo Texto
            ultimoIdNumerico++;
            productoListo.id = ultimoIdNumerico.toString(); 

            // [TASK 5 - POST]: Despachamos el producto limpio hacia el servidor
            await enviarProductoA_API(productoListo);
        }

        mostrarFeedback("¡Sincronización numérica completada con éxito!", "exito");
    } catch (error) {
        console.error("Fallo general en sincronización:", error);
        mostrarFeedback("No se pudo establecer conexión con la API", "error");
    }
});

// Función de envío HTTP POST asíncrona por cada producto
async function enviarProductoA_API(producto) {
    try {
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(producto) 
        });
        if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
    } catch (error) {
        console.error("Error en Fetch POST:", error);
    }
}

// [TASK 5 - GET]: Trae la base de datos de JSON Server e incluye botón Editar (Prepara PUT)
btnMostrarAPI.addEventListener("click", async () => {
    mostrarFeedback("Leyendo registros desde la API...", "exito");
    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error("Error al consultar la API");
        const productosServidor = await respuesta.json();
        
        listaDOM.innerHTML = "";
        if (productosServidor.length === 0) {
            mostrarFeedback("La base de datos de la API se encuentra vacía", "error");
            return;
        }

        // Construcción dinámica inyectando el botón Editar
        productosServidor.forEach(prod => {
            const li = document.createElement("li");
            
            const spanTexto = document.createElement("span");
            spanTexto.textContent = `[ID: ${prod.id}] ${prod.nombre} - $${prod.precio} (Cantidad: ${prod.cantidad}) `;
            li.appendChild(spanTexto);

            // Inyección en el DOM del controlador de edición (PUT)
            const botonEditar = document.createElement("button");
            botonEditar.textContent = "Editar";
            botonEditar.style.backgroundColor = "#6b7280"; // Gris profesional
            
            botonEditar.addEventListener("click", () => {
                // Sube los datos del servidor de vuelta a los campos del HTML
                inputNombre.value = prod.nombre;
                inputPrecio.value = prod.precio;
                inputCantidad.value = prod.cantidad;
                idProductoA_Editar = prod.id; // Guarda el ID de control
                
                // Transforma el botón para indicar el estado de actualización (PUT)
                const btnGuardar = formulario.querySelector("button[type='submit']");
                btnGuardar.textContent = "💡 Actualizar Producto en Servidor (PUT)";
                btnGuardar.style.backgroundColor = "#d97706"; // Naranja advertencia
                
                mostrarFeedback(`Modificando el ID: ${prod.id} en el formulario`, "exito");
            });

            li.appendChild(botonEditar);
            listaDOM.appendChild(li);
        });
        mostrarFeedback("Datos leídos directamente del servidor con éxito", "exito");
    } catch (error) {
        console.error("Error en Fetch GET:", error);
        mostrarFeedback("No se pudieron cargar los datos", "error");
    }
});

// [TASK 5 - DELETE]: Elimina en cascada todos los registros almacenados en el servidor
btnVaciarAPI.addEventListener("click", async () => {
    const confirmar = confirm("¿Estás seguro de que deseas vaciar el servidor?");
    if (!confirmar) return;

    mostrarFeedback("Eliminando registros...", "exito");
    try {
        const respuesta = await fetch(API_URL);
        const productosServidor = await respuesta.json();

        for (const prod of productosServidor) {
            // Envía la solicitud DELETE por cada ID existente
            await fetch(`${API_URL}/${prod.id}`, { method: 'DELETE' });
        }

        listaDOM.innerHTML = "";
        mostrarFeedback("¡Base de datos del servidor vaciada!", "exito");
    } catch (error) {
        console.error("Error al vaciar la API:", error);
    }
});

// =========================================================================
// OPERACIONES AUXILIARES (TASK 4 - Guardado / TASK 2 - Feedback)
// =========================================================================
function guardarEnLocalStorage() {
    localStorage.setItem("productos_local", JSON.stringify(infoProductos));
}

function mostrarFeedback(mensaje, tipoClase) {
    feedback.textContent = mensaje;
    feedback.className = tipoClase; 
    // [TASK 2]: Requisito de registrar evidencias en la consola del navegador
    console.log(`[EVIDENCIA TALLER]: ${mensaje}`);
}
