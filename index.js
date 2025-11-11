// Importaciones de librerías
const express = require('express');
const cors = require('cors');
const sql = require('msnodesqlv8'); // Controlador para SQL Server con Windows Auth
const bcrypt = require('bcrypt'); // Para hashear y verificar contraseñas
const jwt = require('jsonwebtoken'); // Para la gestión de tokens de sesión

const app = express();
const PORT = 3000;

// 🚨 ¡IMPORTANTE! Cambia esto a una clave más segura en tu entorno real
const JWT_SECRET = 'TuClaveSecretaSuperLargaYCompleja'; 
const SALT_ROUNDS = 10; // Nivel de dificultad para bcrypt

// Middlewares
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json()); // Permite a Express leer cuerpos JSON

// ====================================================================
// CONFIGURACIÓN DE CONEXIÓN A SQL SERVER (msnodesqlv8)
// ====================================================================

// 💡 NOTA IMPORTANTE: Verifica la configuración de tu conexión
const connectionString = 'Driver={ODBC Driver 17 for SQL Server};' + 
                         'Server=localhost\\SQLEXPRESS;' + 
                         'Database=SistemaSeguridadElectronica;' + 
                         'Trusted_Connection=Yes;';

// Función Helper para ejecutar consultas SQL de forma asíncrona
function executeQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        // msnodesqlv8 abre y cierra la conexión automáticamente por cada query
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

// ====================================================================
// MIDDLEWARE DE AUTENTICACIÓN
// ====================================================================

// Función para verificar el token JWT en las peticiones
function verifyToken(req, res, next) {
    // Buscar el token en el encabezado 'Authorization' (formato: "Bearer <token>")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        // 401: Unauthorized (no hay token)
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token de autenticación.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            // 403: Forbidden (token inválido o expirado)
            console.error("Token JWT inválido:", err.message);
            return res.status(403).json({ message: 'Token de autenticación inválido o expirado.' });
        }
        
        // El token es válido, guardamos la información del usuario en la petición
        req.user = user; 
        // Continuar con la ejecución de la ruta
        next(); 
    });
}

// ------------------------------------------------------------------
// RUTAS PRINCIPALES DEL API (Rutas de Test y Metadatos)
// ------------------------------------------------------------------

// Ruta 1: Bienvenida (Test de Express)
app.get('/', (req, res) => {
    res.send('API Node.js para Sistema de Seguridad. Lista para la Autenticación.');
});

// Ruta 2: Test de Conexión y Consulta (Verificar que la DB funciona)
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

// Ruta de Datos Maestros
app.get('/api/metadata', async (req, res) => {
    try {
        const rolesQuery = 'SELECT ID_Rol, NombreRol FROM ROLES ORDER BY NombreRol;';
        const sectoresQuery = 'SELECT ID_Sector, NombreSector FROM SECTORES ORDER BY NombreSector;';

        const roles = await executeQuery(rolesQuery);
        const sectores = await executeQuery(sectoresQuery);

        res.status(200).json({
            message: '✅ Metadata de Roles y Sectores disponible.',
            metadata: {
                roles: roles,
                sectores: sectores
            }
        });
    } catch (error) {
        res.status(500).json({
            message: '❌ ERROR: No se pudieron obtener los datos maestros.',
            error: error.message
        });
    }
});

// ------------------------------------------------------------------
// RUTA POST (CREATE): REGISTRO DE USUARIO
// ------------------------------------------------------------------
// POST /api/register -> Crea un nuevo usuario
app.post('/api/register', async (req, res) => {
    const { nombre, email, password, idSector, idRol, telefono } = req.body; 

    if (!nombre || !email || !password || !idSector || !idRol) {
        return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    try {
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const query = `
            INSERT INTO USUARIOS (Nombre, Email, PasswordHash, ID_Sector, ID_Rol, Telefono, Activo)
            OUTPUT INSERTED.ID_Usuario, INSERTED.Nombre, INSERTED.Email
            VALUES (?, ?, ?, ?, ?, ?, 1)
        `;
        
        const result = await executeQuery(query, [nombre, email, passwordHash, idSector, idRol, telefono]);

        if (result && result.length > 0) {
            const nuevoUsuario = result[0];
            
            console.log(`👤 USUARIO REGISTRADO EXITOSAMENTE: ID: ${nuevoUsuario.ID_Usuario}`);

            res.status(201).json({ 
                message: '✅ Usuario registrado exitosamente.', 
                usuario: {
                    id: nuevoUsuario.ID_Usuario,
                    nombre: nuevoUsuario.Nombre,
                    email: nuevoUsuario.Email
                }
            });
        }
        
    } catch (error) {
        let message = 'Error interno del servidor al registrar el usuario.';
        
        if (error.message.includes('UNIQUE KEY constraint')) {
            message = 'El email ya se encuentra registrado.';
        } else if (error.message.includes('FOREIGN KEY constraint')) {
            message = 'El ID de Sector o Rol no es válido. (Verifique que existan en la DB).';
        }
        
        res.status(500).json({ message: message, error: error.message });
    }
});

// ------------------------------------------------------------------
// RUTA POST (LOGIN): INICIO DE SESIÓN
// ------------------------------------------------------------------
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Faltan email y/o contraseña.' });
    }

    try {
        // 1. Buscar usuario por email
        const userQuery = `
            SELECT U.ID_Usuario, U.Email, U.PasswordHash, U.Nombre, U.ID_Rol, U.Activo, R.NombreRol 
            FROM USUARIOS U
            JOIN ROLES R ON U.ID_Rol = R.ID_Rol
            WHERE U.Email = ?
        `;
        const users = await executeQuery(userQuery, [email]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const user = users[0];

        // 2. Verificar si el usuario está inactivo (soft delete)
        if (user.Activo === false) {
             return res.status(401).json({ message: 'Usuario inactivo. Contacte al administrador.' });
        }

        // 3. Comparar la contraseña (hashing)
        const isMatch = await bcrypt.compare(password, user.PasswordHash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }
        
        // 4. Generar JWT
        const token = jwt.sign(
            { 
                id: user.ID_Usuario, 
                email: user.Email, 
                rol: user.NombreRol 
            }, 
            JWT_SECRET, 
            { expiresIn: '1h' } // El token expira en 1 hora
        );

        console.log(`🔑 INICIO DE SESIÓN EXITOSO: Usuario: ${user.Nombre}`);

        // 5. Devolver el token y datos del usuario
        res.status(200).json({
            message: '✅ Inicio de sesión exitoso.',
            token: token,
            user: {
                id: user.ID_Usuario,
                nombre: user.Nombre,
                rol: user.NombreRol,
                email: user.Email,
                activo: user.Activo
            }
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Error interno del servidor durante el login.', 
            error: error.message 
        });
    }
});

// ------------------------------------------------------------------
// RUTA GET 1/3: OBTENER TODOS LOS USUARIOS (Protegida)
// ------------------------------------------------------------------
// GET /api/users -> Obtiene todos los usuarios (activos e inactivos)
app.get('/api/users', verifyToken, async (req, res) => {
    try {
        const query = `
            SELECT 
                U.ID_Usuario, U.Nombre, U.Email, U.Telefono, U.Activo,
                R.NombreRol, S.NombreSector
            FROM USUARIOS U
            JOIN ROLES R ON U.ID_Rol = R.ID_Rol
            JOIN SECTORES S ON U.ID_Sector = S.ID_Sector
            ORDER BY U.ID_Usuario
        `;
        
        const users = await executeQuery(query);

        res.status(200).json({
            message: `✅ Se encontraron ${users.length} usuarios (activos e inactivos).`,
            total: users.length,
            usuarios: users.map(user => ({
                id: user.ID_Usuario,
                nombre: user.Nombre,
                email: user.Email,
                telefono: user.Telefono,
                activo: user.Activo,
                rol: user.NombreRol,
                sector: user.NombreSector
            }))
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error interno del servidor al obtener todos los usuarios.',
            error: error.message
        });
    }
});

// ------------------------------------------------------------------
// RUTA GET 2/3: OBTENER USUARIOS ACTIVOS (Por Criterio) (Protegida)
// ------------------------------------------------------------------
// GET /api/users/active -> Obtiene solo usuarios con Activo = 1
app.get('/api/users/active', verifyToken, async (req, res) => {
    try {
        const query = `
            SELECT 
                U.ID_Usuario, U.Nombre, U.Email, U.Telefono, U.Activo,
                R.NombreRol, S.NombreSector
            FROM USUARIOS U
            JOIN ROLES R ON U.ID_Rol = R.ID_Rol
            JOIN SECTORES S ON U.ID_Sector = S.ID_Sector
            WHERE U.Activo = 1  -- Filtro por criterio
            ORDER BY U.Nombre
        `;
        
        const users = await executeQuery(query);

        res.status(200).json({
            message: `✅ Se encontraron ${users.length} usuarios activos.`,
            total: users.length,
            usuarios: users.map(user => ({
                id: user.ID_Usuario,
                nombre: user.Nombre,
                email: user.Email,
                telefono: user.Telefono,
                activo: user.Activo,
                rol: user.NombreRol,
                sector: user.NombreSector
            }))
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error interno del servidor al obtener usuarios activos.',
            error: error.message
        });
    }
});

// ------------------------------------------------------------------
// RUTA GET 3/3: BUSCAR USUARIO POR ID (Ya Existente) (Protegida)
// ------------------------------------------------------------------
// GET /api/users/:id -> Busca un usuario por su ID
app.get('/api/users/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
        return res.status(400).json({ message: 'El ID de usuario debe ser un número válido.' });
    }

    try {
        const query = `
            SELECT 
                U.ID_Usuario, 
                U.Nombre, 
                U.Email, 
                U.Telefono, 
                U.Activo,
                R.NombreRol,
                S.NombreSector
            FROM USUARIOS U
            JOIN ROLES R ON U.ID_Rol = R.ID_Rol
            JOIN SECTORES S ON U.ID_Sector = S.ID_Sector
            WHERE U.ID_Usuario = ?
        `;
        
        const users = await executeQuery(query, [id]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const user = users[0];
        
        res.status(200).json({
            message: '✅ Usuario encontrado exitosamente.',
            usuario: {
                id: user.ID_Usuario,
                nombre: user.Nombre,
                email: user.Email,
                telefono: user.Telefono,
                activo: user.Activo,
                rol: user.NombreRol,
                sector: user.NombreSector
            }
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error interno del servidor al buscar el usuario.',
            error: error.message
        });
    }
});

// ------------------------------------------------------------------
// RUTA PUT (UPDATE): ACTUALIZAR USUARIO (Protegida)
// ------------------------------------------------------------------
// PUT /api/users/:id -> Actualiza Nombre, Teléfono, Rol, y Sector
app.put('/api/users/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    // Permite actualizar nombre, teléfono, ID de sector y ID de rol.
    // 💡 NOTA: El email y la contraseña se manejan en rutas separadas.
    const { nombre, telefono, idSector, idRol } = req.body; 

    if (isNaN(parseInt(id))) {
        return res.status(400).json({ message: 'El ID de usuario debe ser un número válido.' });
    }

    // Mínimo de campos para actualizar.
    if (!nombre && !telefono && !idSector && !idRol) {
        return res.status(400).json({ message: 'Se requiere al menos un campo para actualizar (nombre, telefono, idSector, idRol).' });
    }
    
    try {
        // 1. Construir dinámicamente la consulta de actualización
        const updates = [];
        const params = [];

        if (nombre) { updates.push('Nombre = ?'); params.push(nombre); }
        if (telefono) { updates.push('Telefono = ?'); params.push(telefono); }
        if (idSector) { updates.push('ID_Sector = ?'); params.push(idSector); }
        if (idRol) { updates.push('ID_Rol = ?'); params.push(idRol); }

        // 2. Si no hay nada que actualizar, terminar (aunque ya se chequeó arriba)
        if (updates.length === 0) {
            return res.status(400).json({ message: 'No hay campos válidos para actualizar.' });
        }

        const query = `
            UPDATE USUARIOS 
            SET ${updates.join(', ')}
            OUTPUT INSERTED.ID_Usuario, INSERTED.Nombre, INSERTED.Email, INSERTED.Telefono, INSERTED.ID_Sector, INSERTED.ID_Rol
            WHERE ID_Usuario = ?
        `;
        
        params.push(id); // Añadir el ID al final de los parámetros
        
        const result = await executeQuery(query, params);

        if (result.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado para actualizar.' });
        }
        
        const updatedUser = result[0];
        
        console.log(`🔄 USUARIO ACTUALIZADO: ID: ${updatedUser.ID_Usuario}, Email: ${updatedUser.Email}`);

        res.status(200).json({
            message: `✅ Usuario (ID: ${id}) ha sido actualizado exitosamente.`,
            usuario: updatedUser
        });

    } catch (error) {
        let message = 'Error interno del servidor al intentar actualizar el usuario.';
        if (error.message.includes('FOREIGN KEY constraint')) {
            message = 'El ID de Sector o Rol proporcionado no existe.';
        }
        res.status(500).json({
            message: message,
            error: error.message
        });
    }
});


// ------------------------------------------------------------------
// RUTA DELETE: ELIMINACIÓN LÓGICA (SOFT DELETE) (Protegida)
// ------------------------------------------------------------------
// DELETE /api/users/:id -> Desactiva (Soft Delete) al usuario
app.delete('/api/users/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
        return res.status(400).json({ message: 'El ID de usuario debe ser un número válido.' });
    }
    
    try {
        const query = `
            UPDATE USUARIOS 
            SET Activo = 0 
            OUTPUT DELETED.ID_Usuario, DELETED.Nombre, DELETED.Email, INSERTED.Activo
            WHERE ID_Usuario = ? AND Activo = 1
        `; // Solo actualiza si ya está activo
        
        const result = await executeQuery(query, [id]);

        if (result.length === 0) {
            // El usuario no existía o ya estaba inactivo
            return res.status(404).json({ message: 'Usuario no encontrado o ya estaba inactivo.' });
        }
        
        const deactivatedUser = result[0];
        
        console.log(`❌ USUARIO DESACTIVADO (Soft Delete): ID: ${deactivatedUser.ID_Usuario}`);

        res.status(200).json({
            message: `✅ Usuario (ID: ${id}) ha sido desactivado (borrado lógico) exitosamente.`,
            usuario: {
                id: deactivatedUser.ID_Usuario,
                nombre: deactivatedUser.Nombre,
                email: deactivatedUser.Email,
                activo: deactivatedUser.Activo // Debe ser 0 (false)
            }
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error interno del servidor al intentar desactivar el usuario.',
            error: error.message
        });
    }
});

// ------------------------------------------------------------------
// RUTA PROTEGIDA (EJEMPLO)
// ------------------------------------------------------------------
// GET /api/user/profile -> Solo accesible con un Token JWT válido
app.get('/api/user/profile', verifyToken, (req, res) => {
    // La información del usuario decodificada está en req.user
    res.status(200).json({
        message: 'Acceso a perfil exitoso. Ruta protegida.',
        data: {
            id: req.user.id,
            email: req.user.email,
            rol: req.user.rol,
            info_adicional: 'Esta es información sensible que solo se ve con el token.'
        }
    });
});


// ------------------------------------------------------------------
// INICIO Y VERIFICACIÓN DEL SERVIDOR
// ------------------------------------------------------------------
// Función para verificar la conexión a la DB antes de iniciar Express
async function checkDatabaseConnection() {
    try {
        // Ejecuta una consulta simple para confirmar la conectividad
        await executeQuery('SELECT 1 as test');
        console.log('✅ CONEXIÓN DB EXITOSA: El servidor puede comunicarse con SQL Server.');
    } catch (error) {
        console.error('❌ ERROR FATAL: No se pudo establecer la conexión inicial con SQL Server.');
        console.error('Detalle:', error.message);
        console.log('----------------------------------------------------');
        console.log('Verifica la cadena de conexión (Server, Database) y el Driver ODBC.');
        console.log('----------------------------------------------------');
        process.exit(1); // Detener la aplicación si la DB no está disponible
    }
}

async function startServer() {
    // 1. Verificar la conexión a la base de datos
    await checkDatabaseConnection(); 
    // 2. Iniciar Express
    app.listen(PORT, () => {
        console.log('----------------------------------------------------');
        console.log(`🚀 Servidor Express iniciado en: http://localhost:${PORT}`);
        console.log('----------------------------------------------------');
        console.log('RUTAS COMPLETAS (USUARIOS):');
        console.log('----------------------------------------------------');
        console.log('CREATE (POST):');
        console.log(`  - POST /api/register (Registrar un nuevo usuario)`);
        console.log('READ (GET x 3):');
        console.log(`  - GET /api/users         (Todos los usuarios)`);
        console.log(`  - GET /api/users/active  (Usuarios activos - con criterio)`);
        console.log(`  - GET /api/users/:id     (Buscar usuario por ID)`);
        console.log('UPDATE (PUT):');
        console.log(`  - PUT /api/users/:id     (Actualizar datos generales)`);
        console.log('DELETE (DELETE):');
        console.log(`  - DELETE /api/users/:id  (Borrado Lógico: Activo = 0)`);
        console.log('----------------------------------------------------');
    });
}
startServer();