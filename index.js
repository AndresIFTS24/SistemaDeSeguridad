/**
 * OPTIMUS - SISTEMA DE SEGURIDAD ELECTRÓNICA
 * Archivo: index.js
 * Estado: WebSockets con Socket.io integrado
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const { checkDatabaseConnection, pool } = require('./src/config/db.config');

// Origen permitido para CORS (REST + Socket.io). En desarrollo apunta al
// front local; en otros entornos se define via variable de entorno.
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';

// 1. IMPORTACIÓN DE RUTAS
const authRoutes             = require('./src/routes/auth.routes');
const abonadoRoutes          = require('./src/routes/abonado.routes');
const modeloDispositivoRoutes = require('./src/routes/modeloDispositivo.routes');
const dispositivoRoutes      = require('./src/routes/dispositivo.routes');
const asignacionRoutes       = require('./src/routes/asignacion.routes');
const eventoRoutes           = require('./src/routes/evento.routes');
const dashboardRoutes        = require('./src/routes/dashboard.routes');
const codigosEventosRoutes   = require('./src/routes/codigos-eventos.routes');
const itRoutes                = require('./src/routes/it.routes');

const app    = express();
const server = http.createServer(app);
const PORT   = process.env.PORT || 3000;

// 2. SOCKET.IO
const io = new Server(server, {
    cors: {
        origin: FRONTEND_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

app.set('io', io);

io.on('connection', (socket) => {
    console.log(`🔌 Cliente WebSocket conectado: ${socket.id}`);
    socket.on('disconnect', () => {
        console.log(`🔌 Cliente WebSocket desconectado: ${socket.id}`);
    });
});

// 3. MIDDLEWARES
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

// 4. RUTAS DE DIAGNÓSTICO
app.get('/', (req, res) => {
    res.send('🚀 API OPTIMUS funcionando con WebSockets habilitados.');
});

app.get('/api/status', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT NOW() AS FechaServidor, DATABASE() AS BaseDeDatos;');
        res.status(200).json({
            message: '✅ Conexión a MySQL en Clever Cloud exitosa.',
            websockets: `${io.engine.clientsCount} cliente(s) conectados`,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ message: '❌ ERROR BD', error: error.message });
    }
});

// 5. MONTAJE DE RUTAS
app.use('/api',               authRoutes);
app.use('/api/abonados',      abonadoRoutes);
app.use('/api/modelos',       modeloDispositivoRoutes);
app.use('/api/dispositivos',  dispositivoRoutes);
app.use('/api/asignaciones',  asignacionRoutes);
app.use('/api/eventos',       eventoRoutes);
app.use('/api/dashboard',     dashboardRoutes);
app.use('/api/codigos-eventos', codigosEventosRoutes);
app.use('/api/it', itRoutes);

// 6. INICIO DEL SERVIDOR
async function startServer() {
    try {
        await checkDatabaseConnection();
        server.listen(PORT, '0.0.0.0', () => {
            console.log('----------------------------------------------------');
            console.log(`🚀 Servidor OPTIMUS iniciado en puerto: ${PORT}`);
            console.log(`🔌 WebSockets (Socket.io) activos en puerto: ${PORT}`);
            console.log('----------------------------------------------------');
        });
    } catch (err) {
        console.error("❌ Fallo crítico:", err.message);
    }
}

startServer();