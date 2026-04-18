/**
 * OPTIMUS - SISTEMA DE SEGURIDAD ELECTRÓNICA
 * Archivo: index.js
 * Estado: Corregido para compatibilidad con Angular (Login y Abonados)
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { checkDatabaseConnection, pool } = require('./src/config/db.config');

// 1. IMPORTACIÓN DE RUTAS MODULARIZADAS
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const abonadoRoutes = require('./src/routes/abonado.routes');
const modeloDispositivoRoutes = require('./src/routes/modeloDispositivo.routes');
const dispositivoRoutes = require('./src/routes/dispositivo.routes');
const asignacionRoutes = require('./src/routes/asignacion.routes');
const eventoRoutes = require('./src/routes/evento.routes');

const app = express();
const PORT = process.env.PORT || 3000; 

// 2. MIDDLEWARES
app.use(cors()); 
app.use(express.json()); 

// 3. RUTAS DE BIENVENIDA Y DIAGNÓSTICO
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
        res.status(500).json({ message: '❌ ERROR BD', error: error.message });
    }
});

// 4. MONTAJE DE RUTAS MODULARIZADAS
/**
 * IMPORTANTE: 
 * - Usamos '/api' para Auth para que coincida con Angular (/api/login).
 * - Usamos '/api/abonados' para evitar que Node confunda la lista general con un ID.
 */

// Esto permite que el login funcione como: POST /api/login
app.use('/api', authRoutes); 

// Esto permite que abonados funcione como: GET /api/abonados
app.use('/api/abonados', abonadoRoutes); 

// Rutas restantes con prefijos claros
app.use('/api/usuarios', userRoutes);
app.use('/api/modelos', modeloDispositivoRoutes);
app.use('/api/dispositivos', dispositivoRoutes);
app.use('/api/asignaciones', asignacionRoutes);
app.use('/api/eventos', eventoRoutes);

// 5. INICIO DEL SERVIDOR
async function startServer() {
    try {
        await checkDatabaseConnection(); 
        app.listen(PORT, '0.0.0.0', () => {
            console.log('----------------------------------------------------');
            console.log(`🚀 Servidor OPTIMUS iniciado en puerto: ${PORT}`);
            console.log('----------------------------------------------------');
        });
    } catch (err) {
        console.error("❌ Fallo crítico:", err.message);
    }
}

startServer();