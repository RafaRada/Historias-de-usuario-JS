// 1. CAPTURA DE ELEMENTOS DEL DOM (PASO 2)
const inputNota = document.getElementById('inpu tNota');
const btnAgregar = document.getElementById('btnAgregar');
const listaNotas = document.getElementById('listaNotas');

// Arreglo donde guardamos el texto de las notas en la memoria del programa
let notas = [];


//LOGICA VISUAL: AGREGAR Y ELIMINAR NOTAS (PASO 3 Y 4)

// Escuchar el clic en el botón de agregar
btnAgregar.addEventListener('click', function() {
    const textoNota = inputNota.value.trim();

    // Validar que no esté vacío
    if (textoNota === "") {
        alert("Por favor, escribe algo.");
        return; 
    }

    //  Guardar el texto en nuestro arreglo
    notas.push(textoNota);

    //  Dibujar la nota en la pantalla
    crearElementoNotaEnDOM(textoNota);

    //  DEJAR CONSTANCIA EN EL LOCAL STORAGE
    guardarEnLocalStorage();

    // Limpiar el input
    inputNota.value = "";
    inputNota.focus();
});

// Función para crear la nota 
function crearElementoNotaEnDOM(texto) {
    const nuevoLi = document.createElement('li');
    nuevoLi.textContent = texto;

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.className = 'btn-eliminar';

    // Al hacer clic en eliminar...
    btnEliminar.addEventListener('click', function() {
        nuevoLi.remove(); // Borrar de la pantalla

        // Sacar el texto borrado de nuestro arreglo de notas
        notas = notas.filter(nota => nota !== texto);
        
        // ACTUALIZAR EL LOCAL STORAGE (YA NO EXISTE ESTA NOTA)
        guardarEnLocalStorage();
    });

    nuevoLi.appendChild(btnEliminar);
    listaNotas.appendChild(nuevoLi);
}


// 3. PERSISTENCIA: FUNCIONES DE LOCAL STORAGE (PASO 5)

// Guarda la lista actual en el disco duro del navegador
function guardarEnLocalStorage() {
    // Convertimos el arreglo a un texto plano (JSON) y lo guardamos
    localStorage.setItem('misNotas', JSON.stringify(notas));
}

// Recupera las notas guardadas cuando la página se abre por primera vez
function cargarNotasDeLocalStorage() {
    const notasGuardadas = localStorage.getItem('misNotas');
    
    // Si el navegador encuentra que guardamos algo antes...
    if (notasGuardadas) {
        // Convertimos ese texto de vuelta a un arreglo real
        notas = JSON.parse(notasGuardadas);
        
        // Reconstruimos la lista en pantalla nota por nota
        notas.forEach(function(textoNota) {
            crearElementoNotaEnDOM(textoNota);
        });
    }
}

// AL ENTRAR A LA PÁGINA: Ejecutamos la carga automática
cargarNotasDeLocalStorage();


//value sirve para extraer el textpo de una caja de txt
//trim sirve para quitar los espacios