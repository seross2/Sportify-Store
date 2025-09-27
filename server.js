const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// Middlewares para parsear el cuerpo de las peticiones (JSON y URL-encoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a la base de datos (o crearla si no existe)
const db = new sqlite3.Database('./sportify.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Conectado a la base de datos sportify.db.');
});

// Crear la tabla de productos e insertar datos si no existe
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        imageUrl TEXT
    )`, (err) => {
    // -----------------------------------------------------------------
    // AQUÍ ES DONDE DEBES PONER TU PROPIO CÓDIGO SQL
    // Pega aquí el código SQL que diseñaste para crear tus tablas.
    const tuCodigoSQL = `
      -- Por ejemplo: CREATE TABLE IF NOT EXISTS productos ( ... );
      -- Por ejemplo: CREATE TABLE IF NOT EXISTS categorias ( ... );
    `;

    db.exec(tuCodigoSQL, (err) => {
        if (err) {
            return console.error(err.message);
        }
        // Verificar si la tabla ya tiene datos
        const sql = `SELECT COUNT(id) as count FROM products`;
        db.get(sql, [], (err, row) => {
            if (err) {
                return console.error(err.message);
            }
            if (row.count === 0) {
                console.log('Insertando productos de ejemplo...');
                const insert = 'INSERT INTO products (name, description, price, imageUrl) VALUES (?,?,?,?)';
                db.run(insert, ["Zapatillas de Running", "Las mejores para correr maratones.", 120.50, "https://via.placeholder.com/300x200?text=Zapatillas"]);
                db.run(insert, ["Camiseta Técnica", "Transpirable y ligera.", 45.00, "https://via.placeholder.com/300x200?text=Camiseta"]);
                db.run(insert, ["Balón de Fútbol", "Balón oficial de la liga.", 89.99, "https://via.placeholder.com/300x200?text=Balón"]);
            }
        });
        console.log("Base de datos configurada con tu estructura SQL.");

        // --- IMPORTANTE ---
        // Si quieres añadir datos de ejemplo, puedes hacerlo aquí con db.run()
        // Asegúrate de que los nombres de tabla y columnas coincidan con tu diseño.
        // Ejemplo:
        // const insert = 'INSERT INTO productos (nombre, descripcion, precio, imagenUrl) VALUES (?,?,?,?)';
        // db.run(insert, ["Producto 1", "Descripción 1", 99.99, "url_imagen_1"]);
    });
});

// Servir archivos estáticos (CSS, JS del lado del cliente, imágenes)
app.use(express.static(path.join(__dirname)));

// Crear una ruta de API para obtener los productos
app.get('/api/products', (req, res) => {
    const sql = "SELECT * FROM products";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

// Ruta de API para el formulario de contacto
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "Todos los campos son requeridos." });
    }

    // Por ahora, solo mostraremos el mensaje en la consola del servidor.
    // Más adelante, podrías guardar esto en una tabla 'messages' en la base de datos.
    console.log('--- Nuevo Mensaje de Contacto Recibido ---');
    console.log(`Nombre: ${name}, Email: ${email}`);
    console.log(`Mensaje: ${message}`);
    console.log('-----------------------------------------');

    res.status(200).json({ message: "Mensaje recibido correctamente. ¡Gracias por contactarnos!" });
});

// Redirigir la ruta raíz a la página de inicio
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});


app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});