const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000 
});

async function checkDatabaseConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ CONEXIÓN EXITOSA A LA BASE DE DATOS');
        connection.release();
    } catch (error) {
        console.error('❌ ERROR DE CONEXIÓN:', error.message);
    }
}

module.exports = { pool, checkDatabaseConnection };