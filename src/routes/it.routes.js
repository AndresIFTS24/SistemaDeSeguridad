// src/routes/it.routes.js
// Panel IT — Administración completa del sistema

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db.config');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

// Roles con acceso al panel IT
const accesoIT = [
    'Administrador',
    'Administrador General',
    'Administrador IT',
    'Ingeniero de IT',
    'Dirección General',
    '1', 1, '3', 3
];

// Lectura del listado de usuarios — además de IT/Dirección, Técnica y Campo
// (sector 5) lo necesita para el roster de técnicos activos. Separado de
// accesoIT a propósito: ese array también gatea creación/edición/baja de
// usuarios y endpoints de auditoría/infraestructura, que Técnica no debe
// poder tocar.
const accesoUsuariosLectura = [...accesoIT, '5', 5];

// ====================================================================
// PESTAÑA 1 — GESTIÓN DE USUARIOS
// ====================================================================

// GET /api/it/usuarios — listado completo con rol y sector
router.get('/usuarios', verifyToken, checkRole(accesoUsuariosLectura), async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT U.ID_Usuario, U.Nombre, U.Email, U.Telefono, U.Activo,
                   U.ID_Rol, U.ID_Sector,
                   R.NombreRol, S.NombreSector
            FROM USUARIOS U
            INNER JOIN ROLES R ON U.ID_Rol = R.ID_Rol
            LEFT JOIN SECTORES S ON U.ID_Sector = S.ID_Sector
            ORDER BY U.Nombre
        `);
        res.status(200).json({
            message: `✅ Se encontraron ${rows.length} usuarios.`,
            total: rows.length,
            usuarios: rows
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios.', error: error.message });
    }
});

// POST /api/it/usuarios — crear usuario con hash de contraseña
router.post('/usuarios', verifyToken, checkRole(accesoIT), async (req, res) => {
    const { Nombre, Email, PasswordHash, Telefono, ID_Sector, ID_Rol } = req.body;

    if (!Nombre || !Email || !PasswordHash || !ID_Rol) {
        return res.status(400).json({ message: 'Faltan campos obligatorios: Nombre, Email, Password y Rol.' });
    }

    try {
        const [existing] = await pool.execute('SELECT ID_Usuario FROM USUARIOS WHERE Email = ?', [Email]);
        if (existing.length > 0) {
            return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(PasswordHash, salt);

        const [result] = await pool.execute(
            'INSERT INTO USUARIOS (Nombre, Email, PasswordHash, Telefono, ID_Sector, ID_Rol, Activo) VALUES (?, ?, ?, ?, ?, ?, 1)',
            [Nombre, Email, hash, Telefono || null, ID_Sector || null, ID_Rol]
        );

        res.status(201).json({
            message: '✅ Usuario creado exitosamente.',
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el usuario.', error: error.message });
    }
});

// PUT /api/it/usuarios/:id — editar usuario (nombre, email, rol, sector, telefono)
router.put('/usuarios/:id', verifyToken, checkRole(accesoIT), async (req, res) => {
    const { id } = req.params;
    const { Nombre, Email, Telefono, ID_Sector, ID_Rol } = req.body;

    if (!Nombre || !Email || !ID_Rol) {
        return res.status(400).json({ message: 'Nombre, Email y Rol son obligatorios.' });
    }

    try {
        const [result] = await pool.execute(
            'UPDATE USUARIOS SET Nombre = ?, Email = ?, Telefono = ?, ID_Sector = ?, ID_Rol = ? WHERE ID_Usuario = ?',
            [Nombre, Email, Telefono || null, ID_Sector || null, ID_Rol, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.status(200).json({ message: '✅ Usuario actualizado correctamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario.', error: error.message });
    }
});

// PUT /api/it/usuarios/:id/toggle — activar / desactivar usuario
router.put('/usuarios/:id/toggle', verifyToken, checkRole(accesoIT), async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.execute('SELECT Activo FROM USUARIOS WHERE ID_Usuario = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const nuevoEstado = rows[0].Activo === 1 ? 0 : 1;
        await pool.execute('UPDATE USUARIOS SET Activo = ? WHERE ID_Usuario = ?', [nuevoEstado, id]);

        res.status(200).json({
            message: nuevoEstado === 1 ? '✅ Usuario activado.' : '✅ Usuario desactivado.',
            activo: nuevoEstado
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al cambiar el estado del usuario.', error: error.message });
    }
});

// ====================================================================
// PESTAÑA 2 — ESTADO DEL SISTEMA
// ====================================================================

router.get('/status', verifyToken, checkRole(accesoIT), async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT NOW() AS FechaServidor, DATABASE() AS BaseDeDatos, VERSION() AS VersionMySQL');
        const io = req.app.get('io');

        res.status(200).json({
            message: '✅ Estado del sistema OK.',
            baseDeDatos: {
                conectado: true,
                nombre: rows[0].BaseDeDatos,
                version: rows[0].VersionMySQL,
                fechaServidor: rows[0].FechaServidor,
                connectionLimit: 4
            },
            webSockets: {
                clientesConectados: io ? io.engine.clientsCount : 0
            },
            servidor: {
                uptimeSegundos: Math.floor(process.uptime()),
                nodeVersion: process.version,
                entorno: process.env.NODE_ENV || 'development'
            }
        });
    } catch (error) {
        res.status(500).json({
            message: '❌ Error al obtener el estado del sistema.',
            baseDeDatos: { conectado: false },
            error: error.message
        });
    }
});

// ====================================================================
// PESTAÑA 3 — AUDITORÍA Y ACTIVIDAD
// ====================================================================

// GET /api/it/auditoria — últimos seguimientos de eventos
router.get('/auditoria', verifyToken, checkRole(accesoIT), async (req, res) => {
    try {
        const [seguimientos] = await pool.execute(`
    SELECT 
        SE.ID_Seguimiento, SE.FechaHoraAccion, SE.AccionRealizada,
        U.Nombre AS NombreOperador,
        E.ID_Evento, CE.DescripcionAlarma, AB.RazonSocial AS NombreAbonado
    FROM SEGUIMIENTOS_EVENTOS SE
    INNER JOIN USUARIOS U ON SE.ID_Operador = U.ID_Usuario
    INNER JOIN EVENTOS E ON SE.ID_Evento = E.ID_Evento
    INNER JOIN CODIGOS_EVENTOS CE ON E.ID_CodigoEvento = CE.ID_CodigoEvento
    INNER JOIN DISPOSITIVOS D ON E.ID_Dispositivo = D.ID_Dispositivo
    INNER JOIN DIRECCIONES DIR ON D.ID_Direccion = DIR.ID_Direccion
    INNER JOIN ABONADOS AB ON DIR.ID_Abonado = AB.ID_Abonado
    ORDER BY SE.FechaHoraAccion DESC
    LIMIT 25
`);

        const [cuentasDesactivadas] = await pool.execute(`
    SELECT u.ID_Usuario, u.Nombre, u.Email, s.NombreSector, r.NombreRol
    FROM USUARIOS u
    JOIN SECTORES s ON u.ID_Sector = s.ID_Sector
    JOIN ROLES r ON u.ID_Rol = r.ID_Rol
    WHERE u.Activo = 0
    ORDER BY u.Nombre
    LIMIT 10
`);

        res.status(200).json({
            message: '✅ Auditoría obtenida correctamente.',
            seguimientos,
            cuentasDesactivadas
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la auditoría.', error: error.message });
    }
});


// ====================================================================
// PESTAÑA 4 — INFRAESTRUCTURA
// ====================================================================

router.get('/infraestructura', verifyToken, checkRole(accesoIT), async (req, res) => {
    try {
        const [[dispositivos]] = await pool.execute(`
            SELECT
                SUM(CASE WHEN Estado = 'Operativo' THEN 1 ELSE 0 END) AS operativos,
                SUM(CASE WHEN Estado != 'Operativo' THEN 1 ELSE 0 END) AS fueraDeServicio,
                COUNT(*) AS total
            FROM DISPOSITIVOS
        `);

        const [stockCritico] = await pool.execute(`
            SELECT S.ID_Stock, MD.NombreModelo, S.Cantidad, S.UbicacionFisica
            FROM STOCK S
            INNER JOIN MODELOS_DISPOSITIVOS MD ON S.ID_Modelo = MD.ID_Modelo
            WHERE S.Cantidad <= 5
            ORDER BY S.Cantidad ASC
        `);

        const [stockTotal] = await pool.execute(`
            SELECT MD.NombreModelo, S.Cantidad, S.UbicacionFisica
            FROM STOCK S
            INNER JOIN MODELOS_DISPOSITIVOS MD ON S.ID_Modelo = MD.ID_Modelo
            ORDER BY S.Cantidad ASC
        `);

        res.status(200).json({
            message: '✅ Datos de infraestructura obtenidos.',
            dispositivos,
            stockCritico,
            stockTotal
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener infraestructura.', error: error.message });
    }
});

// ====================================================================
// PESTAÑA 5 — ROLES Y SECTORES
// ====================================================================

router.get('/roles-sectores', verifyToken, checkRole(accesoIT), async (req, res) => {
    try {
        const [roles] = await pool.execute(`
            SELECT R.ID_Rol, R.NombreRol, COUNT(U.ID_Usuario) AS TotalUsuarios
            FROM ROLES R
            LEFT JOIN USUARIOS U ON R.ID_Rol = U.ID_Rol
            GROUP BY R.ID_Rol
            ORDER BY R.NombreRol
        `);

        const [sectores] = await pool.execute(`
            SELECT S.ID_Sector, S.NombreSector, COUNT(U.ID_Usuario) AS TotalUsuarios
            FROM SECTORES S
            LEFT JOIN USUARIOS U ON S.ID_Sector = U.ID_Sector
            GROUP BY S.ID_Sector
            ORDER BY S.NombreSector
        `);

        res.status(200).json({
            message: '✅ Roles y sectores obtenidos.',
            roles,
            sectores
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener roles y sectores.', error: error.message });
    }
});


// ====================================================================
// HISTORIAL DE ACTIVIDAD POR USUARIO
// ====================================================================

router.get('/usuarios/:id/actividad', verifyToken, checkRole(accesoIT), async (req, res) => {
    const { id } = req.params;
    try {
        const [usuario] = await pool.execute(`
            SELECT U.ID_Usuario, U.Nombre, U.Email, U.Activo,
                   R.NombreRol, S.NombreSector
            FROM USUARIOS U
            INNER JOIN ROLES R ON U.ID_Rol = R.ID_Rol
            LEFT JOIN SECTORES S ON U.ID_Sector = S.ID_Sector
            WHERE U.ID_Usuario = ?
        `, [id]);

        if (usuario.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const [actividad] = await pool.execute(`
    SELECT 
        SE.ID_Seguimiento,
        SE.FechaHoraAccion,
        SE.AccionRealizada,
        E.ID_Evento,
        CE.DescripcionAlarma,
        AB.RazonSocial AS NombreAbonado,
        E.Estado AS EstadoEvento
    FROM SEGUIMIENTOS_EVENTOS SE
    INNER JOIN EVENTOS E ON SE.ID_Evento = E.ID_Evento
    INNER JOIN CODIGOS_EVENTOS CE ON E.ID_CodigoEvento = CE.ID_CodigoEvento
    INNER JOIN DISPOSITIVOS D ON E.ID_Dispositivo = D.ID_Dispositivo
    INNER JOIN DIRECCIONES DIR ON D.ID_Direccion = DIR.ID_Direccion
    INNER JOIN ABONADOS AB ON DIR.ID_Abonado = AB.ID_Abonado
    WHERE SE.ID_Operador = ?
    ORDER BY SE.FechaHoraAccion DESC
    LIMIT 50
`, [id]);

        const [resumen] = await pool.execute(`
            SELECT 
                COUNT(*) AS totalAcciones,
                MAX(SE.FechaHoraAccion) AS ultimaAccion,
                COUNT(DISTINCT SE.ID_Evento) AS eventosAtendidos
            FROM SEGUIMIENTOS_EVENTOS SE
            WHERE SE.ID_Operador = ?
        `, [id]);

        res.status(200).json({
            message: '✅ Actividad obtenida correctamente.',
            usuario: usuario[0],
            resumen: resumen[0],
            actividad
        });

    } catch (error) {
        res.status(500).json({ message: 'Error al obtener actividad.', error: error.message });
    }
});

// ====================================================================
// DETALLE DE EVENTO (para el panel lateral de Auditoría)
// ====================================================================
router.get('/eventos/:idEvento/detalle', verifyToken, checkRole(accesoIT), async (req, res) => {
    const { idEvento } = req.params;
    try {
        const [evento] = await pool.execute(`
            SELECT E.ID_Evento, E.FechaHoraRecepcion, E.Estado,
                   CE.Codigo, CE.DescripcionAlarma, CE.Prioridad,
                   AB.RazonSocial AS NombreAbonado, AB.NumeroDeAbonado,
                   DIR.Calle, DIR.Ciudad,
                   D.NombreDispositivo, D.Zona_Ubicacion
            FROM EVENTOS E
            INNER JOIN CODIGOS_EVENTOS CE ON E.ID_CodigoEvento = CE.ID_CodigoEvento
            INNER JOIN DISPOSITIVOS D ON E.ID_Dispositivo = D.ID_Dispositivo
            INNER JOIN DIRECCIONES DIR ON D.ID_Direccion = DIR.ID_Direccion
            INNER JOIN ABONADOS AB ON DIR.ID_Abonado = AB.ID_Abonado
            WHERE E.ID_Evento = ?
        `, [idEvento]);

        if (evento.length === 0) {
            return res.status(404).json({ message: 'Evento no encontrado.' });
        }

        const [seguimientos] = await pool.execute(`
            SELECT SE.ID_Seguimiento, SE.FechaHoraAccion, SE.AccionRealizada, U.Nombre AS NombreOperador
            FROM SEGUIMIENTOS_EVENTOS SE
            INNER JOIN USUARIOS U ON SE.ID_Operador = U.ID_Usuario
            WHERE SE.ID_Evento = ?
            ORDER BY SE.FechaHoraAccion ASC
        `, [idEvento]);

        res.status(200).json({
            message: '✅ Detalle del evento obtenido.',
            evento: evento[0],
            seguimientos
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el detalle del evento.', error: error.message });
    }
});

module.exports = router;