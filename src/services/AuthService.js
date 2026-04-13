// src/services/AuthService.js
const { pool } = require('../config/db.config');
const bcrypt = require('bcryptjs'); // Lo dejamos importado pero no lo usaremos ahora
const jwt = require('jsonwebtoken');

class AuthService {
    /**
     * Lógica de inicio de sesión (MODO SIMPLE - SIN ENCRIPTACIÓN)
     */
    static async login({ email, password }) {
        console.log("----------------------------------------------------");
        console.log(">> 📥 INTENTO DE LOGIN (MODO SIMPLE) RECIBIDO");
        console.log(">> Email:", email);

        // 1. Buscar al usuario por email en MySQL
        const query = `
            SELECT u.ID_Usuario, u.Nombre, u.Email, u.PasswordHash, u.Activo, r.NombreRol 
            FROM USUARIOS u
            INNER JOIN ROLES r ON u.ID_Rol = r.ID_Rol
            WHERE u.Email = ?
        `;
        
        const [rows] = await pool.execute(query, [email]);

        // 2. Verificar si el usuario existe
        if (rows.length === 0) {
            console.log(">> ❌ RESULTADO: Usuario no encontrado.");
            const error = new Error('Credenciales inválidas');
            error.cause = 401;
            throw error;
        }

        const user = rows[0];
        console.log(">> ✅ USUARIO ENCONTRADO:", user.Email);
        console.log(">> 🗄️ PASSWORD EN DB:", user.PasswordHash);

        // 3. Verificar si el usuario está activo
        if (!user.Activo) {
            console.log(">> ⚠️ RESULTADO: El usuario está INACTIVO.");
            const error = new Error('Usuario desactivado');
            error.cause = 403;
            throw error;
        }

        // 4. COMPARACIÓN SIMPLE (TEXTO PLANO) ⚡
        console.log(">> ⚖️ COMPARANDO TEXTO DIRECTO...");
        
        // Comparamos lo que escribió el usuario con lo que hay en la columna PasswordHash
        const isMatch = (password === user.PasswordHash);
        
        console.log(">> ¿COINCIDE?:", isMatch);

        if (!isMatch) {
            console.log(">> ❌ RESULTADO: La contraseña es incorrecta.");
            const error = new Error('Credenciales inválidas');
            error.cause = 401;
            throw error;
        }

        // 5. Generar el Token JWT
        console.log(">> 🔑 GENERANDO TOKEN...");
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

        console.log(">> 🚀 LOGIN EXITOSO PARA:", user.Nombre);
        console.log("----------------------------------------------------");

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