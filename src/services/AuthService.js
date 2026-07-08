/**
 * OPTIMUS - SISTEMA DE SEGURIDAD ELECTRÓNICA
 * Servicio de Autenticación Centralizado
 */
const { pool } = require('../config/db.config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/jwt.config');
require('dotenv').config();

class AuthService {
    static async login({ email, password }) {
        // 1. Consulta con JOIN para traer el nombre del Sector real
        const query = `
    SELECT 
        u.ID_Usuario, u.Nombre, u.Email, u.PasswordHash, 
        u.ID_Rol, u.ID_Sector, u.Activo, u.Telefono,
        s.NombreSector,
        r.NombreRol
    FROM USUARIOS u
    INNER JOIN SECTORES s ON u.ID_Sector = s.ID_Sector
    INNER JOIN ROLES r ON u.ID_Rol = r.ID_Rol
    WHERE u.Email = ?
`;

        const [users] = await pool.execute(query, [email]); 

        // 2. Validaciones de Seguridad
        if (users.length === 0) {
            const err = new Error('El correo electrónico no está registrado.');
            err.cause = 401; 
            throw err;
        }

        const user = users[0];

        // Validación de contraseña (hash bcrypt)
        const passwordValida = await bcrypt.compare(password, user.PasswordHash);
        if (!passwordValida) {
            const err = new Error('Contraseña incorrecta.');
            err.cause = 401;
            throw err;
        }

        // Verificación de cuenta activa
        if (user.Activo !== 1) {
            const err = new Error('Tu cuenta está suspendida. Contacta al administrador.');
            err.cause = 403;
            throw err;
        }

        // 3. Generación de Token JWT
        // Usamos la misma clave que el Middleware
         const token = jwt.sign(
    {
        id: user.ID_Usuario,
        email: user.Email,
        idSector: user.ID_Sector,
        nombreSector: user.NombreSector,
        rol: user.NombreRol
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
);

        // 4. Retorno de información estructurada para el Frontend
        return {
            token,
            user: {
                id: user.ID_Usuario,
                nombre: user.Nombre,
                email: user.Email,
                idRol: user.ID_Rol,
                idSector: user.ID_Sector,
                nombreSector: user.NombreSector,
                telefono: user.Telefono
            }
        };
    }
}

module.exports = AuthService;