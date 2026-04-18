// src/middleware/auth.middleware.js

const jwt = require('jsonwebtoken');
// En Clever Cloud, las variables se cargan solas en process.env. 
// Quitamos la ruta fija '../../.env' para evitar errores de lectura.
require('dotenv').config(); 

// *** ¡CRÍTICO! Esta clave DEBE ser EXACTAMENTE la misma que en AuthService.js ***
const JWT_SECRET = process.env.JWT_SECRET || 'seguridad_total_2024'; 

/**
 * Middleware para verificar la validez del token JWT.
 */
exports.verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        // El formato esperado es "Bearer <token>"
        const token = authHeader && authHeader.split(' ')[1]; 

        if (!token) {
            return res.status(401).json({ message: 'Acceso denegado. Se requiere un token de autenticación.' });
        }

        // Verificar el token usando la clave secreta
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error("❌ Error de Verificación JWT:", err.message);
                return res.status(401).json({ 
                    message: 'Token de autenticación inválido o expirado.',
                    error: err.message 
                });
            }
            
            // Adjuntar los datos del usuario a la solicitud
            req.user = decoded; 
            next();
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error interno en la validación del token.' });
    }
};

/**
 * Middleware para verificar si el usuario tiene permiso (por Rol o por Sector).
 * @param {Array<string|number>} permitidos - Array de nombres o IDs permitidos.
 */
exports.checkRole = (permitidos) => {
    return (req, res, next) => {
        // Log para ver qué llega en el token (lo verás en el panel de Clever Cloud)
        console.log("DATOS DEL TOKEN RECIBIDO:", req.user);

        if (!req.user) {
            return res.status(403).json({ message: 'Acceso denegado. Usuario no identificado.' });
        }

        const uRol = req.user.rol || req.user.NombreSector || req.user.role; // Probamos varios nombres
        const uSector = String(req.user.idSector || req.user.ID_Sector || '');

        // NORMALIZACIÓN
        const listaNormalizada = permitidos.map(p => String(p).toLowerCase().trim());

        // BUSCAMOS COINCIDENCIA
        const coincideRol = uRol && listaNormalizada.includes(uRol.toLowerCase().trim());
        const coincideSector = uSector && listaNormalizada.includes(uSector);

        // 🔥 LA SALIDA DE EMERGENCIA: 
        // Si el email es el de Beatriz (o el tuyo), la dejamos pasar aunque el rol falle
        const esUsuarioEspecial = req.user.email === 'EL_EMAIL_DE_BEATRIZ@TU_APP.COM'; // Pon el mail de ella aquí

        if (coincideRol || coincideSector || esUsuarioEspecial) {
            return next();
        }

        return res.status(403).json({ 
            message: 'Acceso denegado. No tiene los permisos necesarios.',
            debug: { rol_encontrado: uRol, sector_encontrado: uSector } 
        });
    };
};