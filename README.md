# Sportify Store

Sportify Store es una aplicación web de comercio electrónico simple para una tienda de deportes. Incluye funcionalidades para ver productos, registro e inicio de sesión de usuarios y un formulario de contacto.

El backend está construido con Node.js y Express, y utiliza SQLite como base de datos.

## Requisitos Previos

Antes de empezar, asegúrate de tener instalado el siguiente software en tu sistema:

- **[Node.js](https://nodejs.org/)**: Se recomienda la versión 16 o superior.
- **[npm](https://www.npmjs.com/)**: Generalmente se instala automáticamente con Node.js.
- **[Git](https://git-scm.com/)**: Para clonar el repositorio.

## Instalación y Puesta en Marcha

Sigue estos pasos para tener una copia del proyecto funcionando en tu máquina local.

### 1. Clonar el Repositorio

Abre tu terminal o línea de comandos y ejecuta el siguiente comando para clonar el proyecto:

```bash
git clone https://github.com/seross2/Sportify-Store.git
```

Luego, navega al directorio del proyecto:

```bash
cd Sportify-Store
```

### 2. Instalar Dependencias del Servidor

El proyecto tiene algunas dependencias de Node.js que son necesarias para que el servidor funcione. Primero, instala las que faltan en `package.json` y luego instala todas las demás.

```bash
# Instala las dependencias que faltan y las guarda en package.json
npm install bcryptjs express-session connect-sqlite3

# Instala el resto de dependencias listadas en package.json
npm install
```

### 3. Iniciar el Servidor

Una vez instaladas las dependencias, puedes iniciar el servidor con el siguiente comando:

```bash
npm start
```

Si todo ha ido bien, verás un mensaje en la consola indicando que el servidor está en marcha:

```
Servidor corriendo en http://localhost:3000
Conectado a la base de datos sportify.db.
Creando tablas si no existen...
La tabla de productos ya contiene datos.
```

**¡Eso es todo!** Ahora puedes abrir tu navegador y visitar http://localhost:3000 para ver la aplicación funcionando.

## ¿Cómo Funciona?

- **Base de Datos**: Al iniciar el servidor por primera vez, se creará automáticamente un archivo de base de datos SQLite llamado `sportify.db` dentro de la carpeta `servidor/bd/`. También se crearán las tablas `products`, `users` y `messages`, y se llenará la tabla `products` con datos de ejemplo.
- **Sesiones**: Las sesiones de usuario se guardan en un archivo de base de datos separado llamado `sessions.db` en la misma carpeta.

## Estructura del Proyecto

```
Sportify-Store/
├── js/                # Archivos JavaScript del lado del cliente
│   ├── auth.js
│   ├── contact-api.js
│   └── productos.js
├── pages/             # Páginas HTML de la aplicación
│   ├── contactenos.html
│   ├── index.html
│   ├── login.html
│   ├── Productos.html
│   └── registro.html
├── servidor/          # Lógica del backend (Node.js)
│   ├── bd/
│   │   └── database.js # Configuración y creación de la BD
│   └── server.js       # Servidor principal de Express y API
├── Styles/            # Hojas de estilo CSS
│   └── estilos.css
├── package.json       # Dependencias y scripts del proyecto
└── README.md          # Este archivo
```

## Scripts Disponibles

En el archivo `package.json`, encontrarás el siguiente script:

- `npm start`: Inicia el servidor de Node.js usando `node servidor/server.js`.

## Endpoints de la API

El servidor expone una API REST para gestionar productos, usuarios y mensajes.

- `GET /api/products`: Obtiene todos los productos.
- `GET /api/products/:id`: Obtiene un producto por su ID.
- `POST /api/contact`: Envía un mensaje desde el formulario de contacto.
- `POST /api/register`: Registra un nuevo usuario.
- `POST /api/login`: Inicia sesión.
- `GET /api/logout`: Cierra la sesión del usuario.
- `GET /api/session`: Verifica el estado de la sesión actual.
