const express = require('express');
const path = require('path');
const db = require('./database.js'); // Importamos la configuración de la base de datos

const app = express();
const port = 3000;

// Middlewares para parsear el cuerpo de las peticiones (JSON y URL-encoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Servir archivos estáticos (CSS, JS del lado del cliente, imágenes)
app.use(express.static(path.join(__dirname)));

// Crear una ruta de API para obtener los productos
// --- API CRUD PARA PRODUCTOS ---

// READ (All): Obtener todos los productos
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

// READ (One): Obtener un producto por su ID
app.get('/api/products/:id', (req, res) => {
    const sql = "SELECT * FROM products WHERE id = ?";
    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ "error": err.message });
        }
        if (row) {
            res.json({ "message": "success", "data": row });
        } else {
            res.status(404).json({ "error": "Producto no encontrado" });
        }
    });
});

// CREATE: Añadir un nuevo producto
app.post('/api/products', (req, res) => {
    const { name, description, price, imageUrl } = req.body;
    if (!name || !price) {
        return res.status(400).json({ "error": "Los campos 'name' y 'price' son requeridos." });
    }
    const sql = `INSERT INTO products (name, description, price, imageUrl) VALUES (?, ?, ?, ?)`;
    db.run(sql, [name, description, price, imageUrl], function(err) {
        if (err) {
            return res.status(500).json({ "error": err.message });
        }
        // Devolvemos el objeto recién creado
        res.status(201).json({
            "message": "Producto creado exitosamente",
            "data": { id: this.lastID, name, description, price, imageUrl }
        });
    });
});

// UPDATE: Actualizar un producto existente
app.put('/api/products/:id', (req, res) => {
    const { name, description, price, imageUrl } = req.body;
    if (!name || !price) {
        return res.status(400).json({ "error": "Los campos 'name' y 'price' son requeridos." });
    }
    const sql = `UPDATE products SET name = ?, description = ?, price = ?, imageUrl = ? WHERE id = ?`;
    db.run(sql, [name, description, price, imageUrl, req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ "error": err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ "error": "Producto no encontrado" });
        }
        res.json({
            "message": "Producto actualizado exitosamente",
            "changes": this.changes
        });
    });
});

// DELETE: Borrar un producto
app.delete('/api/products/:id', (req, res) => {
    const sql = 'DELETE FROM products WHERE id = ?';
    db.run(sql, req.params.id, function(err) {
        if (err) {
            return res.status(500).json({ "error": err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ "error": "Producto no encontrado" });
        }
        res.json({
            "message": "Producto eliminado exitosamente",
            "changes": this.changes
        });
    });
});


// --- API PARA CONTACTO ---

// Ruta de API para el formulario de contacto
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "Todos los campos son requeridos." });
    }

    // Guardar el mensaje en la base de datos
    const sql = `INSERT INTO messages (name, email, message) VALUES (?, ?, ?)`;
    db.run(sql, [name, email, message], function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: "Error al guardar el mensaje en la base de datos." });
        }

        console.log(`Un nuevo mensaje con id ${this.lastID} ha sido guardado.`);
        res.status(201).json({ message: "Mensaje guardado correctamente. ¡Gracias por contactarnos!" });
    });
});

// Redirigir la ruta raíz a la página de inicio
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});


app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});