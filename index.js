/**
 * OPTIMUS - SISTEMA DE SEGURIDAD ELECTRÓNICA
 * Archivo: index.js
 * Descripción: Punto de entrada principal, configuración de middlewares y conexión al servidor.
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importación de configuración de BD (Punto 8.2 de la documentación)
const { checkDatabaseConnection, pool } = require('./src/config/db.config');

// Importaciones de rutas modularizadas
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const abonadoRoutes = require('./src/routes/abonado.routes');
const modeloDispositivoRoutes = require('./src/routes/modeloDispositivo.routes');
const dispositivoRoutes = require('./src/routes/dispositivo.routes');
const asignacionRoutes = require('./src/routes/asignacion.routes');
const eventoRoutes = require('./src/routes/evento.routes');

const app = express();

// Configuración de puerto para Render/Cloud
const PORT = process.env.PORT || 3000; 

// ====================================================================
// MIDDLEWARES GLOBALES
// ====================================================================
app.use(cors()); // Permite peticiones desde el frontend (CORS)
app.use(express.json()); // Permite leer cuerpos JSON en las peticiones

// ====================================================================
// RUTAS DE DIAGNÓSTICO Y BIENVENIDA
// ====================================================================

app.get('/', (req, res) => {
    res.send('🚀 API Sistema de Seguridad OPTIMUS funcionando en MySQL (Clever Cloud).');
});

app.get('/api/status', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT NOW() AS FechaServidor, DATABASE() AS BaseDeDatos;');
        res.status(200).json({
            message: '✅ Conexión a MySQL en Clever Cloud exitosa.',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ 
            message: '❌ ERROR: No se pudo conectar con la base de datos.',
            error: error.message 
        });
    }
});

// ====================================================================
// MONTAJE DE RUTAS MODULARIZADAS
// ====================================================================

// Las rutas de usuarios ahora viven exclusivamente en su archivo userRoutes
app.use('/api', authRoutes);
app.use('/api', userRoutes); 
app.use('/api', abonadoRoutes);
app.use('/api', modeloDispositivoRoutes);
app.use('/api', dispositivoRoutes);
app.use('/api', asignacionRoutes);
app.use('/api', eventoRoutes);

// ====================================================================
// INICIO DEL SERVIDOR
// ====================================================================

async function startServer() {
    try {
        // Verificar la conexión a la base de datos antes de arrancar el servidor
        await checkDatabaseConnection(); 
        
        app.listen(PORT, '0.0.0.0', () => {
            console.log('----------------------------------------------------');
            console.log(`🚀 Servidor iniciado en puerto: ${PORT}`);
            console.log(`🔗 URL local: http://localhost:${PORT}`);
            console.log('----------------------------------------------------');
        });
    } catch (err) {
        console.error("❌ Fallo crítico al iniciar el servidor:", err.message);
    }
}

startServer();