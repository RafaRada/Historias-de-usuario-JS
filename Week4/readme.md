# SPA Vanilla JavaScript - Product Management

## Descripción

Este proyecto es un ejemplo de cómo construir una SPA (Single Page Application) utilizando únicamente JavaScript Vanilla, sin frameworks ni librerías complejas de terceros.

La aplicación implementa:

- Routing básico SPA adaptado a la persistencia
- Renderizado dinámico de vistas y estados
- Arquitectura modular desacoplada
- Consumo de APIs REST (CRUD Completo)
- Componentización a nivel de UI
- Separación de responsabilidades
- Persistencia de datos híbrida (Local/Remoto)
- Buenas prácticas de documentación con JSDoc

---

# Características

## Captura de Productos

- Formulario modular completamente desacoplado
- Validación estricta de tipos de datos y rangos numéricos
- Controladores de eventos optimizados para interceptar el envío nativo

## Listado Dinámico

- Renderizado dinámico de nodos interactivos en el DOM
- Sincronización híbrida adaptada a almacenamiento fuera de línea (*Offline Cache*)
- Gestión de acciones individuales (Eliminación por nodo)

## Panel de Control de API (Servidor)

- **Sincronización Inteligente (POST):** Validación previa de duplicación por nombre y cálculo manual de claves correlativas numéricas secuenciales.
- **Persistencia en Pantalla (GET):** Consulta transaccional que dibuja el estado real de la base de datos remota con soporte para el método **PUT** (Edición en caliente).
- **Destrucción de Colecciones (DELETE):** Vaciado automatizado del servidor mediante resolución de promesas concurrentes.

---

# Tecnologías y Lenguajes Utilizados

- **HTML5**: Estructura semántica pura de la interfaz y elementos del formulario.
- **CSS3**: Diseño visual moderno utilizando Variables nativas, Flexbox y Animaciones de transición.
- **JavaScript ES6+**: Programación lógica, manipulación activa del DOM, Web APIs (LocalStorage), Fetch API y asincronía avanzada (`Async/Await`).
- **JSON (JavaScript Object Notation)**: Estructuración y transferencia de datos livianos entre el cliente y el servidor.
- **Node.js / NPM**: Entorno de ejecución y gestor de paquetes para controlar las dependencias de desarrollo.
- **JSON Server**: Motor de persistencia y enrutamiento automatizado para la simulación de la API RESTful.

---

# Estructura del proyecto

```txt
.
├── assets
│   ├── css
│   │   └── style.css
│   └── js
│       └── app.js
├── index.html
├── json
│   └── db.json
├── package.json
├── package-lock.json
└── readme.md
```

---

# Ejecución del proyecto

## Configurar el Servidor de Datos (`db.json`)

Dentro de la ruta `json/db.json`, inicializa el archivo de persistencia física con su colección base vacía:

```json
{
  "productos": []
}
```

## Ejecutar el proyecto

Para levantar la API RESTful simulada con soporte CORS (permisos del navegador) y mapeo en el puerto local, ejecuta el siguiente comando en tu terminal:

```bash
npx json-server --watch json/db.json --port 3002 --cors
```

> **⚠️ Nota de Despliegue:** Mantén la consola encendida mientras utilizas la aplicación. Posteriormente, abre el archivo `index.html` en tu navegador web de preferencia utilizando un servidor local de desarrollo (como la extensión *Live Server* de VS Code) para evitar restricciones de seguridad de archivos locales (`file://`).
