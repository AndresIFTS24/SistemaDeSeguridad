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
        if (!req.user) {
            return res.status(403).json({ message: 'Usuario no identificado.' });
        }

        // Leemos el rol o el nombre del sector que pusimos en el token
        const uRol = String(req.user.rol || req.user.nombreSector || '').toLowerCase().trim();
        const uSectorId = String(req.user.idSector || '').trim();

        // Normalizamos la lista de permitidos a minúsculas
        const listaNormalizada = permitidos.map(p => String(p).toLowerCase().trim());

        // Si el usuario tiene el nombre del sector o el ID en la lista de permitidos, pasa.
        const tienePermiso = listaNormalizada.includes(uRol) || listaNormalizada.includes(uSectorId);

        if (tienePermiso) {
            return next();
        }

        return res.status(403).json({ 
            message: 'Tu perfil no tiene acceso a este sector.',
            debug: { sector_usuario: uRol } 
        });
    };
};