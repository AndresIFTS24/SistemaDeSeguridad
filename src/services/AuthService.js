const { pool } = require('../config/db.config');
const jwt = require('jsonwebtoken');

class AuthService {
    static async login({ email, password }) {
        // 1. Consulta con JOIN para traer el Sector
        const query = `
            SELECT 
                u.ID_Usuario, u.Nombre, u.Email, u.PasswordHash, 
                u.ID_Rol, u.ID_Sector, u.Activo, u.Telefono,
                s.NombreSector
            FROM USUARIOS u
            INNER JOIN SECTORES s ON u.ID_Sector = s.ID_Sector
            WHERE u.Email = ?
        `;

        const [users] = await pool.execute(query, [email]); 

        if (users.length === 0) {
            const err = new Error('Credenciales inválidas');
            err.cause = 401; // Forzamos la propiedad cause
            throw err;
        }

        const user = users[0];

        // 2. Validación de contraseña (Texto plano según tu carga masiva)
        if (user.PasswordHash !== password) {
            const err = new Error('Credenciales inválidas');
            err.cause = 401;
            throw err;
        }

        if (user.Activo !== 1) {
            const err = new Error('Usuario inactivo');
            err.cause = 401;
            throw err;
        }

        // 3. Generación de Token
        const secret = process.env.JWT_SECRET || 'optimus_secret_2026';
        const token = jwt.sign(
            { id: user.ID_Usuario, email: user.Email, idSector: user.ID_Sector },
            secret,
            { expiresIn: '8h' }
        );

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