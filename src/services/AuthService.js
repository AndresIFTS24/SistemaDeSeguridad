// src/services/AuthService.js
const { pool } = require('../config/db.config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
    /**
     * Lógica de inicio de sesión (Login)
     */
    static async login(email, password) {
        // 1. Buscar al usuario por email en MySQL
        // MySQL devuelve un array, usamos [rows] para obtener los datos
        const query = `
            SELECT u.ID_Usuario, u.Nombre, u.Email, u.PasswordHash, u.Activo, r.NombreRol 
            FROM USUARIOS u
            INNER JOIN ROLES r ON u.ID_Rol = r.ID_Rol
            WHERE u.Email = ?
        `;
        
        const [rows] = await pool.execute(query, [email]);

        // 2. Verificar si el usuario existe
        if (rows.length === 0) {
            const error = new Error('Credenciales inválidas (Usuario no encontrado).');
            error.cause = 401;
            throw error;
        }

        const user = rows[0];

        // 3. Verificar si el usuario está activo (Borrado lógico)
        if (!user.Activo) {
            const error = new Error('El usuario está desactivado. Contacte al administrador.');
            error.cause = 403;
            throw error;
        }

        // 4. Comparar la contraseña enviada con el Hash de la DB
        const isMatch = await bcrypt.compare(password, user.PasswordHash);
        if (!isMatch) {
            const error = new Error('Credenciales inválidas (Contraseña incorrecta).');
            error.cause = 401;
            throw error;
        }

        // 5. Generar el Token JWT
        const payload = {
            id: user.ID_Usuario,
            nombre: user.Nombre,
            rol: user.NombreRol
        };

        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET || 'Firma_Secreta_Provisional_123', 
            { expiresIn: '8h' }
        );

        // 6. Retornar datos del usuario (sin la contraseña) y el token
        return {
            token,
            usuario: {
                id: user.ID_Usuario,
                nombre: user.Nombre,
                email: user.Email,
                rol: user.NombreRol
            }
        };
    }
}

module.exports = AuthService;