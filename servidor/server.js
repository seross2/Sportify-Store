const express = require('express');
const path = require('path');
const db = require('./bd/database.js'); // Importamos la configuración de la base de datos
const bcrypt = require('bcryptjs');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

const app = express();
const port = 3000;

// Middlewares para parsear el cuerpo de las peticiones (JSON y URL-encoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de la sesión
app.use(session({
    store: new SQLiteStore({ db: 'sessions.db', dir: path.join(__dirname, 'bd') }),
    secret: 'un secreto muy secreto', // ¡Cambia esto por una cadena más segura en producción!
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 7 * 24 * 60 * 60 * 1000, // La sesión dura 1 semana
        httpOnly: true // Previene acceso desde JS en el cliente
    } 
}));

// Servir archivos estáticos (CSS, JS del lado del cliente, imágenes)
// Hacemos que la carpeta raíz del proyecto sea accesible públicamente para servir
// todos los archivos estáticos (HTML, CSS, JS, etc.).
const publicPath = path.join(__dirname, '..');
app.use(express.static(publicPath));

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

// --- API PARA AUTENTICACIÓN ---

// REGISTER: Registrar un nuevo usuario
app.post('/api/register', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ "error": "Email y contraseña son requeridos." });
    }

    // Hashear la contraseña antes de guardarla
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const sql = `INSERT INTO users (email, password) VALUES (?, ?)`;
    db.run(sql, [email, hash], function(err) {
        if (err) {
            // El código 19 es de restricción UNIQUE, significa que el email ya existe
            if (err.errno === 19) {
                return res.status(409).json({ "error": "El correo electrónico ya está registrado." });
            }
            return res.status(500).json({ "error": err.message });
        }
        res.status(201).json({
            "message": "Usuario registrado exitosamente",
            "userId": this.lastID
        });
    });
});

// LOGIN: Iniciar sesión
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ "error": "Email y contraseña son requeridos." });
    }

    const sql = `SELECT * FROM users WHERE email = ?`;
    db.get(sql, [email], (err, user) => {
        if (err) {
            return res.status(500).json({ "error": err.message });
        }
        // Si no se encuentra el usuario o la contraseña no coincide
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ "error": "Credenciales incorrectas." });
        }

        // Guardar el ID del usuario en la sesión
        req.session.userId = user.id;
        req.session.userEmail = user.email;

        res.json({
            "message": "Inicio de sesión exitoso",
            "user": { id: user.id, email: user.email }
        });
    });
});

// LOGOUT: Cerrar sesión
app.get('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ "error": "No se pudo cerrar la sesión." });
        }
        // Limpiar la cookie en el cliente
        res.clearCookie('connect.sid'); 
        res.json({ "message": "Sesión cerrada exitosamente." });
    });
});

// SESSION: Verificar estado de la sesión
app.get('/api/session', (req, res) => {
    if (req.session.userId) {
        res.json({
            loggedIn: true,
            user: { id: req.session.userId, email: req.session.userEmail }
        });
    } else {
        res.json({ loggedIn: false });
    }
});


// Redirigir la ruta raíz a la página de inicio
// Express.static ya se encarga de servir index.html por defecto si existe.
// Si no, esta ruta lo asegura.
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'pages', 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});