// index.js - Versión Final para MySQL & Render - Sistema OPTIMUS

// 1. Importaciones de Librerías y Configuración
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importaciones desde la carpeta 'src'
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

// CONFIGURACIÓN DE PUERTO PARA RENDER
const PORT = process.env.PORT || 3000; 

// ====================================================================
// MIDDLEWARES GLOBALES
// ====================================================================
app.use(cors());
app.use(express.json());

// ====================================================================
// RUTAS PRINCIPALES DEL API
// ====================================================================

// Ruta 1: Bienvenida
app.get('/', (req, res) => {
    res.send('🚀 API Sistema de Seguridad OPTIMUS funcionando en MySQL (Clever Cloud).');
});

// Ruta 2: Test de Conexión
app.get('/api/status', async (req, res) => {
    try {
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

// Ruta 3: Actualizar Usuario (UPDATE)
app.put('/api/usuarios/:id', async (req, res) => {
    const userId = req.params.id;
    const { Nombre, Email, ID_Rol } = req.body;

    if (!Nombre || !Email || !ID_Rol) {
        return res.status(400).json({ 
            error: "Faltan datos", 
            message: "Asegúrate de enviar Nombre, Email e ID_Rol en el body" 
        });
    }

    try {
        const query = "UPDATE USUARIOS SET Nombre = ?, Email = ?, ID_Rol = ? WHERE ID_Usuario = ?";
        const [result] = await pool.execute(query, [Nombre, Email, ID_Rol, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "No se encontró el usuario con el ID especificado" });
        }

        res.json({ 
            mensaje: "✅ Usuario actualizado con éxito en la plataforma OPTIMUS",
            id_modificado: userId 
        });
    } catch (error) {
        console.error("Error en el UPDATE de OPTIMUS:", error);
        res.status(500).json({ error: "Error de base de datos", details: error.message });
    }
});

// Ruta 4: Eliminar Usuario (DELETE)
app.delete('/api/usuarios/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const query = "DELETE FROM USUARIOS WHERE ID_Usuario = ?";
        const [result] = await pool.execute(query, [userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "❌ No se encontró el usuario para eliminar." });
        }

        res.json({ 
            mensaje: "✅ Usuario eliminado correctamente del sistema OPTIMUS",
            id_eliminado: userId 
        });
    } catch (error) {
        console.error("Error en DELETE:", error);
        res.status(500).json({ 
            error: "No se pudo eliminar el usuario", 
            details: "Es posible que el usuario tenga datos vinculados (historial, asignaciones) que impiden el borrado por integridad referencial." 
        });
    }
});

// Ruta 5: Crear Usuario (CREATE)
app.post('/api/usuarios', async (req, res) => {
    const { Nombre, Email, PasswordHash, Telefono, ID_Sector, ID_Rol } = req.body;

    // Validación básica de campos obligatorios
    if (!Nombre || !Email || !PasswordHash || !ID_Rol) {
        return res.status(400).json({ error: "Faltan datos obligatorios (Nombre, Email, PasswordHash, ID_Rol)" });
    }

    try {
        const query = "INSERT INTO USUARIOS (Nombre, Email, PasswordHash, Telefono, ID_Sector, ID_Rol) VALUES (?, ?, ?, ?, ?, ?)";
        const [result] = await pool.execute(query, [Nombre, Email, PasswordHash, Telefono, ID_Sector, ID_Rol]);

        res.status(201).json({ 
            mensaje: "✅ Usuario creado con éxito", 
            id_creado: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ error: "Error al crear usuario", details: error.message });
    }
});

// Ruta 6: Obtener todos los usuarios (READ - LIST)
app.get('/api/usuarios', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT ID_Usuario, Nombre, Email, Telefono, ID_Rol, ID_Sector FROM USUARIOS');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener usuarios", details: error.message });
    }
});

// Ruta 7: Obtener un usuario por ID (READ - SINGLE)
app.get('/api/usuarios/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const [rows] = await pool.execute('SELECT ID_Usuario, Nombre, Email, Telefono, ID_Rol, ID_Sector FROM USUARIOS WHERE ID_Usuario = ?', [userId]);
        
        if (rows.length === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el usuario", details: error.message });
    }
});

// ====================================================================
// RUTAS MODULARIZADAS
// ====================================================================
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
        // Verificar conexión antes de arrancar
        await checkDatabaseConnection(); 
        
        app.listen(PORT, '0.0.0.0', () => {
            console.log('----------------------------------------------------');
            console.log(`🚀 Servidor iniciado en puerto: ${PORT}`);
            console.log(`🔗 URL local: http://localhost:${PORT}`);
            console.log('----------------------------------------------------');
        });
    } catch (err) {
        console.error("No se pudo iniciar el servidor debido a errores en la base de datos.");
    }
}

startServer();