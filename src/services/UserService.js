// src/services/UserService.js
const { pool } = require('../config/db.config');
const bcrypt = require('bcryptjs');

class UserService {
    
    /** * Registrar un nuevo usuario con Hash de seguridad
     */
    static async registerUser(userData) {
        const { Nombre, Email, PasswordHash, Telefono, ID_Sector, ID_Rol } = userData;

        // 1. Validar si el email ya existe en la base de datos
        const [existing] = await pool.execute(
            'SELECT ID_Usuario FROM USUARIOS WHERE Email = ?', 
            [Email]
        );

        if (existing.length > 0) {
            const error = new Error('El correo electrónico ya está registrado.');
            error.cause = 409; // Conflict
            throw error;
        }

        // --- ⚡️ ENCRIPTACIÓN (HASHING) ⚡️ ---
        // Generamos el hash de la contraseña antes de guardarla
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(PasswordHash, salt);

        // 2. Insertar el usuario con la contraseña encriptada
        const sql = `
            INSERT INTO USUARIOS (Nombre, Email, PasswordHash, Telefono, ID_Sector, ID_Rol, Activo) 
            VALUES (?, ?, ?, ?, ?, ?, 1)
        `;
        
        const [result] = await pool.execute(sql, [
            Nombre, Email, hashedPassword, Telefono || null, ID_Sector, ID_Rol
        ]);

        // 3. Retornar los datos (sin la contraseña por seguridad)
        return {
            ID_Usuario: result.insertId,
            Nombre,
            Email,
            ID_Sector,
            ID_Rol
        };
    }

    /** Obtener todos los usuarios con sus nombres de Rol y Sector */
    static async getAllUsers() {
        const sql = `
            SELECT U.ID_Usuario, U.Nombre, U.Email, U.Telefono, U.Activo, 
                   S.NombreSector, R.NombreRol
            FROM USUARIOS U
            INNER JOIN SECTORES S ON U.ID_Sector = S.ID_Sector
            INNER JOIN ROLES R ON U.ID_Rol = R.ID_Rol
        `;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    /** Obtener solo usuarios activos */
    static async getActiveUsers() {
        const sql = `
            SELECT U.ID_Usuario, U.Nombre, U.Email, U.Telefono, 
                   S.NombreSector, R.NombreRol
            FROM USUARIOS U
            INNER JOIN SECTORES S ON U.ID_Sector = S.ID_Sector
            INNER JOIN ROLES R ON U.ID_Rol = R.ID_Rol
            WHERE U.Activo = 1
        `;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    /** Obtener un usuario por su ID */
    static async getUserById(id) {
        const sql = `
            SELECT U.ID_Usuario, U.Nombre, U.Email, U.Telefono, U.Activo, 
                   S.NombreSector, R.NombreRol
            FROM USUARIOS U
            INNER JOIN SECTORES S ON U.ID_Sector = S.ID_Sector
            INNER JOIN ROLES R ON U.ID_Rol = R.ID_Rol
            WHERE U.ID_Usuario = ?
        `;
        const [rows] = await pool.execute(sql, [id]);
        
        if (rows.length === 0) {
            const error = new Error('Usuario no encontrado.');
            error.cause = 404;
            throw error;
        }
        return rows[0];
    }

    /** Actualizar datos de un usuario */
    static async updateUserDetails(id, userData) {
        const { Nombre, Telefono, ID_Sector, ID_Rol } = userData;
        
        const sql = `
            UPDATE USUARIOS 
            SET Nombre = ?, Telefono = ?, ID_Sector = ?, ID_Rol = ?
            WHERE ID_Usuario = ?
        `;
        
        const [result] = await pool.execute(sql, [Nombre, Telefono, ID_Sector, ID_Rol, id]);
        
        if (result.affectedRows === 0) {
            const error = new Error('No se pudo actualizar. Usuario no encontrado.');
            error.cause = 404;
            throw error;
        }
        
        return { id, Nombre, message: "Actualizado correctamente" };
    }

    /** Desactivar usuario (Soft Delete) */
    static async deactivateUser(id) {
        const [result] = await pool.execute(
            'UPDATE USUARIOS SET Activo = 0 WHERE ID_Usuario = ?', 
            [id]
        );
        
        if (result.affectedRows === 0) {
            const error = new Error('Usuario no encontrado.');
            error.cause = 404;
            throw error;
        }
        return { id, status: 'Desactivado' };
    }
}

module.exports = UserService;