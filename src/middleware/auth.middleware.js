// src/middleware/auth.middleware.js

const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../../.env' }); // Asegura que la clave secreta se carga aquí también

// *** ¡CRÍTICO! Esta clave DEBE ser EXACTAMENTE la misma que en AuthService.js ***
const JWT_SECRET = process.env.JWT_SECRET || 'TuClaveSecretaSuperLargaYCompleja'; 

/**
 * Middleware para verificar la validez del token JWT.
 */
exports.verifyToken = (req, res, next) => {
    // 1. Obtener el token de la cabecera Authorization
    const authHeader = req.headers['authorization'];
    // El formato esperado es "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        // No hay token o el formato es incorrecto
        return res.status(401).json({ message: 'Acceso denegado. Se requiere un token de autenticación.' });
    }

    // 2. Verificar el token usando la clave secreta
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            // El token es inválido (caducado, firma incorrecta, etc.)
            console.error("JWT Verification Error:", err.message);
            return res.status(401).json({ message: 'Token de autenticación inválido o expirado.' });
        }
        
        // 3. Token válido. Adjuntar los datos del usuario a la solicitud
        req.user = decoded; // { id: 15, email: "...", rol: "Administrador General" }
        next();
    });
};

/**
 * Middleware para verificar si el usuario tiene un rol permitido.
 * @param {Array<string>} rolesPermitidos - Array de nombres de roles (ej: ['Administrador', 'Técnico'])
 */
exports.checkRole = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.user || !req.user.rol) {
            // Esto no debería suceder si verifyToken se ejecuta antes, pero es una buena guardia
            return res.status(403).json({ message: 'Acceso denegado. Rol de usuario no encontrado.' });
        }

        const userRole = req.user.rol;
        
        // Convertir ambos a minúsculas o a un estándar para evitar errores de mayúsculas/minúsculas
        if (!rolesPermitidos.map(r => r.toLowerCase()).includes(userRole.toLowerCase())) {
            return res.status(403).json({ message: 'Acceso denegado. No tiene los permisos necesarios.' });
        }
        
        // El usuario tiene un rol permitido
        next();
    };
};