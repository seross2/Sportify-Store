const sqlite3 = require('sqlite3').verbose();
const DB_SOURCE = './sportify.db';

const db = new sqlite3.Database(DB_SOURCE, (err) => {
    if (err) {
        // No se pudo abrir la base de datos
        console.error(err.message);
        throw err;
    } else {
        console.log('Conectado a la base de datos sportify.db.');
        db.serialize(() => {
            console.log('Creando tablas si no existen...');
            // Crear tabla de productos
            db.run(`CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL,
                imageUrl TEXT
            )`);

            // Crear tabla de mensajes
            db.run(`CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT NOT NULL,
                received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);

            // Verificar si la tabla de productos está vacía para insertar datos de ejemplo
            const sqlCheck = `SELECT COUNT(id) as count FROM products`;
            db.get(sqlCheck, [], (err, row) => {
                if (err) {
                    console.error("Error al verificar productos:", err.message);
                    return;
                }
                if (row.count === 0) {
                    console.log('La tabla de productos está vacía. Insertando datos de ejemplo...');
                    const insert = 'INSERT INTO products (name, description, price, imageUrl) VALUES (?,?,?,?)';
                    db.run(insert, ["Zapatillas de Running", "Las mejores para correr maratones.", 120.50, "https://via.placeholder.com/300x200?text=Zapatillas"]);
                    db.run(insert, ["Camiseta Técnica", "Transpirable y ligera.", 45.00, "https://via.placeholder.com/300x200?text=Camiseta"]);
                    db.run(insert, ["Balón de Fútbol", "Balón oficial de la liga.", 89.99, "https://via.placeholder.com/300x200?text=Balón"]);
                } else {
                    console.log('La tabla de productos ya contiene datos.');
                }
            });
        });
    }
});

module.exports = db;