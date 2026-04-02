// index.js - Versión Final para MySQL & Render

// 1. Importaciones de Librerías y Configuración
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Aseguramos que cargue las variables del .env

// Importaciones desde la carpeta 'src'
// Importamos 'pool' y la función de verificación
const { checkDatabaseConnection, pool } = require('./src/config/db.config');

// Importaciones rutas modularizadas
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const abonadoRoutes = require('./src/routes/abonado.routes');
const modeloDispositivoRoutes = require('./src/routes/modeloDispositivo.routes');
const dispositivoRoutes = require('./src/routes/dispositivo.routes');
const asignacionRoutes = require('./src/routes/asignacion.routes');
const eventoRoutes = require('./src/routes/evento.routes');

const app = express();

// IMPORTANTE PARA RENDER: Usar 0.0.0.0 y puerto dinámico
const PORT = process.env.PORT || 3000; 

// ====================================================================
// MIDDLEWARES GLOBALES
// ====================================================================
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json()); // Permite a Express leer cuerpos JSON

// ====================================================================
// RUTAS PRINCIPALES DEL API
// ====================================================================

// Ruta 1: Bienvenida
app.get('/', (req, res) => {
    res.send('🚀 API Sistema de Seguridad funcionando en MySQL (Clever Cloud).');
});

// Ruta 2: Test de Conexión (Ajustado para MySQL)
app.get('/api/status', async (req, res) => {
    try {
        // En MySQL usamos NOW() y DATABASE()
        const [rows] = await pool.execute('SELECT NOW() AS FechaServidor, DATABASE() AS BaseDeDatos;');
        
        res.status(200).json({
            message: '✅ Conexión a MySQL en Clever Cloud exitosa.',
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({ 
            message: '❌ ERROR: No se pudo conectar con la base de datos MySQL.',
            error: error.message 
        });
    }
});

// Montar las rutas en el prefijo /api
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', abonadoRoutes);
app.use('/api', modeloDispositivoRoutes);
app.use('/api', dispositivoRoutes);
app.use('/api', asignacionRoutes);
app.use('/api', eventoRoutes);

// ====================================================================
// INICIO Y VERIFICACIÓN DEL SERVIDOR
// ====================================================================

async function startServer() {
    // 1. Verificar la conexión a la base de datos antes de arrancar
    await checkDatabaseConnection(); 
    
    // 2. Iniciar Express en el host 0.0.0.0 (necesario para Render)
    app.listen(PORT, '0.0.0.0', () => {
        console.log('----------------------------------------------------');
        console.log(`🚀 Servidor iniciado en puerto: ${PORT}`);
        console.log(`🔗 URL local: http://localhost:${PORT}`);
        console.log('----------------------------------------------------');
    });
}

startServer();