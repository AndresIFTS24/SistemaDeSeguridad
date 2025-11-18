// src/config/db.config.js (CORREGIDO Y FINAL PARA MSSQL/VERCEL)

const sql = require('mssql'); // Módulo compatible con la nube
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); 

// 🚨 Definición de Tipos SQL Comunes para mssql
// Usaremos estos tipos para indicar a mssql qué esperar.
const commonSqlTypes = {
    // Si la clave no está en el objeto, se asume VarChar(255)
    ID_Usuario: sql.Int,
    ID_Rol: sql.Int,
    ID_Sector: sql.Int,
    ID_Dispositivo: sql.Int,
    ID_Modelo: sql.Int,
    ID_Abonado: sql.Int,
    ID_CodigoEvento: sql.Int,
    Email: sql.VarChar(100),
    PasswordHash: sql.VarChar(255), // Ajustar tamaño según tu hash
    Nombre: sql.VarChar(255),
    Telefono: sql.VarChar(20),
    Activo: sql.Bit
    // Agrega más tipos si usas, ej: TipoDispositivo: sql.VarChar(50), NumeroSerie: sql.VarChar(50)
};

// 1. Definir la configuración de conexión
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, // EJ: '127.0.0.1'
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT) || 1433,
    options: {
        encrypt: false, // Puedes poner true si usas Azure/AWS
        trustServerCertificate: true // true para localhost, false para prod con certificado
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000 
    }
};

const pool = new sql.ConnectionPool(dbConfig);
let isPoolConnected = false;

/**
 * Helper para ejecutar consultas SQL de forma asíncrona.
 * @param {string} query - Consulta SQL con marcadores @Nombre.
 * @param {object} [params={}] - Objeto de parámetros {NombreParametro: valor}.
 */
async function executeQuery(query, params = {}) {
    if (!isPoolConnected) {
        await pool.connect();
        isPoolConnected = true;
    }

    try {
        const request = pool.request();
        
        // 🚨 Mapeo CRUCIAL para mssql: Define los parámetros usando request.input()
        if (typeof params === 'object' && params !== null && Object.keys(params).length > 0) {
            for (const paramName in params) {
                if (params.hasOwnProperty(paramName)) {
                    // Determinar el tipo SQL (usa VarChar(255) por defecto si no se especifica)
                    const dataType = commonSqlTypes[paramName] || sql.VarChar(255);
                    
                    // Asignar el parámetro al request
                    request.input(paramName, dataType, params[paramName]);
                }
            }
        }
        
        const result = await request.query(query);
        return result.recordset; 
    } catch (err) {
        console.error("❌ ERROR SQL EJECUTANDO:", query.substring(0, 50) + "...");
        console.error("Detalle del Error:", err.message);
        throw err; // Rebotar el error para que el controlador lo maneje
    }
}

async function checkDatabaseConnection() {
    try {
        // Ejecutar una consulta simple para verificar la conexión
        await executeQuery('SELECT 1');
        console.log('✅ CONEXIÓN DB EXITOSA: El servidor puede comunicarse con SQL Server.');
    } catch (error) {
        console.error('❌ ERROR FATAL: No se pudo establecer la conexión inicial con SQL Server.');
        console.error('Detalle:', error.message);
        console.log('----------------------------------------------------');
        console.log('Verifica las variables de entorno (DB_SERVER, DB_USER, etc.)');
        console.log('----------------------------------------------------');
        // Usar console.log para mostrar las variables que fallaron (solo para debug local)
        // console.log(`Configuración fallida: ${JSON.stringify(dbConfig)}`); 
        process.exit(1);
    }
}

module.exports = {
    executeQuery,
    checkDatabaseConnection,
    closePool: () => pool.close(),
};