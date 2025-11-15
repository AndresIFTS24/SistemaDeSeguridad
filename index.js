// index.js

// 1. Importaciones de Librerías y Configuración
const express = require('express');
const cors = require('cors');

// Importaciones desde la carpeta 'src'
const { checkDatabaseConnection } = require('./src/config/db.config');

// Importar rutas modularizadas
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const abonadoRoutes = require('./src/routes/abonado.routes');
const modeloDispositivoRoutes = require('./src/routes/modeloDispositivo.routes');
const dispositivoRoutes = require('./src/routes/dispositivo.routes');
const asignacionRoutes = require('./src/routes/asignacion.routes');
const eventoRoutes = require('./src/routes/evento.routes');
const app = express();
// Obtener el puerto desde el archivo .env (o usar 3000 por defecto)
const PORT = process.env.PORT || 3000; 

// ====================================================================
// MIDDLEWARES GLOBALES
// ====================================================================
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json()); // Permite a Express leer cuerpos JSON

// ====================================================================
// RUTAS PRINCIPALES DEL API
// ====================================================================

// Ruta 1: Bienvenida (Test de Express)
app.get('/', (req, res) => {
    res.send('API Node.js para Sistema de Seguridad. Estructura modularizada OK.');
});

// Ruta 2: Test de Conexión y Consulta (Verificar que la DB funciona)
const { executeQuery } = require('./src/config/db.config'); // Importamos para esta ruta de test
app.get('/api/status', async (req, res) => {
    try {
        const query = 'SELECT GETDATE() AS FechaServidor, DB_NAME() AS BaseDeDatos;';
        const result = await executeQuery(query);
        
        res.status(200).json({
            message: '✅ Conexión SQL Server exitosa con msnodesqlv8.',
            data: result[0]
        });
    } catch (error) {
        res.status(500).json({ 
            message: '❌ ERROR: La conexión falló durante la ejecución de la consulta.',
            error: error.message 
        });
    }
});

// Montar las rutas en el prefijo /api
app.use('/api', authRoutes); // Rutas de Login y Autenticación
app.use('/api', userRoutes); // Rutas de Gestión de Usuarios
app.use('/api', abonadoRoutes); //Rutas de Gestión de Usuarios
app.use('/api', modeloDispositivoRoutes); //Rutas de Gestión de modelos de dispositivos
app.use('/api', dispositivoRoutes); //Rutas de Gestión de dispositivos
app.use('/api', asignacionRoutes);
app.use('/api', eventoRoutes);
// ====================================================================
// INICIO Y VERIFICACIÓN DEL SERVIDOR
// ====================================================================

async function startServer() {
    // 1. Verificar la conexión a la base de datos
    await checkDatabaseConnection(); 
    
    // 2. Iniciar Express
    app.listen(PORT, () => {
        console.log('----------------------------------------------------');
        console.log(`🚀 Servidor Express iniciado en: http://localhost:${PORT}`);
        console.log('----------------------------------------------------');
    });
}
startServer();