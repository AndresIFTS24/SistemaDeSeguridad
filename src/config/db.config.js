// src/config/db.config.js
const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * CONFIGURACIÓN DEL POOL DE CONEXIONES
 * Usamos el SDK de mysql2 con soporte para Promesas (async/await)
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10, // Ajustable según el tráfico
    queueLimit: 0,
    // Ayuda a mantener la conexión activa en hostings gratuitos
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000 
});

/**
 * Función para verificar la salud de la conexión al iniciar el servidor.
 */
async function checkDatabaseConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('====================================================');
        console.log('✅ CONEXIÓN EXITOSA A CLEVER CLOUD');
        console.log(`📡 Host: ${process.env.DB_HOST}`);
        console.log(`🗄️  BD: ${process.env.DB_NAME}`);
        console.log('====================================================');
        connection.release(); // Importante: liberar la conexión de prueba
    } catch (error) {
        console.error('====================================================');
        console.error('❌ ERROR DE CONEXIÓN A LA BASE DE DATOS');
        console.error('Mensaje:', error.message);
        console.error('Acción: Revisa las credenciales en tu archivo .env');
        console.error('====================================================');
    }
}

// Exportamos el pool para usarlo en los controladores y la función de test
module.exports = { 
    pool, 
    checkDatabaseConnection 
};

const bcryptTest = require('bcryptjs');
bcryptTest.hash('qwer1234', 10).then(hash => {
    console.log('--- COPIA ESTE HASH EN TU BASE DE DATOS ---');
    console.log(hash);
    console.log('-------------------------------------------');
});