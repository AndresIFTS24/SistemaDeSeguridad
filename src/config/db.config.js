// src/config/db.config.js (Código Completo y Corregido)

const sql = require('msnodesqlv8');
require('dotenv').config({ path: '../.env' }); 

// 1. Definir connectionString al nivel superior (Scope Global del Módulo)
const connectionString = process.env.DB_CONNECTION_STRING ||
    'Driver={ODBC Driver 17 for SQL Server};Server=localhost\\SQLEXPRESS;Database=SistemaSeguridadElectronica;Trusted_Connection=Yes;';

/**
 * Helper para ejecutar consultas SQL de forma asíncrona.
 * connectionString es accesible aquí porque está en el mismo ámbito de módulo.
 */
function executeQuery(query, params = []) {
    return new Promise((resolve, reject) => { 
        sql.query(connectionString, query, params, (err, rows) => {
            if (err) {
                console.error("❌ ERROR SQL EJECUTANDO:", query.substring(0, 50) + "...");
                console.error("Detalle del Error:", err.message);
                return reject(err);
            }
            resolve(rows);
        });
    });
}

/**
 * Función para verificar la conexión a la DB antes de iniciar Express.
 */
async function checkDatabaseConnection() {
    try {
        await executeQuery('SELECT 1 as test');
        console.log('✅ CONEXIÓN DB EXITOSA: El servidor puede comunicarse con SQL Server.');
    } catch (error) {
        console.error('❌ ERROR FATAL: No se pudo establecer la conexión inicial con SQL Server.');
        console.error('Detalle:', error.message);
        console.log('----------------------------------------------------');
        console.log('Verifica la cadena de conexión (Server, Database) y el Driver ODBC.');
        console.log('----------------------------------------------------');
        process.exit(1);
    }
}

module.exports = {
    executeQuery,
    checkDatabaseConnection,
    // No es estrictamente necesario, pero es útil para depuración.
    connectionString, 
};