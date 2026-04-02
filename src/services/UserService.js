// src/services/UserService.js
const { pool } = require('../config/db.config');

class UserService {
    
    /** * Registrar un nuevo usuario
     */
    static async registerUser(userData) {
        const { Nombre, Email, PasswordHash, Telefono, ID_Sector, ID_Rol } = userData;

        // 1. Validar si el email ya existe
        const [existing] = await pool.execute(
            'SELECT ID_Usuario FROM USUARIOS WHERE Email = ?', 
            [Email]
        );

        if (existing.length > 0) {
            const error = new Error('El correo electrónico ya está registrado.');
            error.cause = 409; // Conflict
            throw error;
        }

        // 2. Insertar el usuario
        const sql = `
            INSERT INTO USUARIOS (Nombre, Email, PasswordHash, Telefono, ID_Sector, ID_Rol, Activo) 
            VALUES (?, ?, ?, ?, ?, ?, 1)
        `;
        
        const [result] = await pool.execute(sql, [
            Nombre, Email, PasswordHash, Telefono || null, ID_Sector, ID_Rol
        ]);

        // 3. Retornar el usuario creado (result.insertId es el nuevo ID generado)
        return {
            ID_Usuario: result.insertId,
            Nombre,
            Email,
            ID_Sector,
            ID_Rol
        };
    }

    /** * Obtener todos los usuarios
     */
    static async getAllUsers() {
        const query = `
            SELECT u.ID_Usuario, u.Nombre, u.Email, u.Telefono, u.Activo, 
                   s.NombreSector, r.NombreRol 
            FROM USUARIOS u
            INNER JOIN SECTORES s ON u.ID_Sector = s.ID_Sector
            INNER JOIN ROLES r ON u.ID_Rol = r.ID_Rol
        `;
        const [rows] = await pool.execute(query);
        return rows;
    }

    /** * Obtener usuarios activos solamente
     */
    static async getActiveUsers() {
        const query = 'SELECT * FROM USUARIOS WHERE Activo = 1';
        const [rows] = await pool.execute(query);
        return rows;
    }

    /** * Obtener un usuario por su ID
     */
    static async getUserById(id) {
        const query = 'SELECT * FROM USUARIOS WHERE ID_Usuario = ?';
        const [rows] = await pool.execute(query, [id]);

        if (rows.length === 0) {
            const error = new Error('Usuario no encontrado.');
            error.cause = 404;
            throw error;
        }
        return rows[0];
    }

    /** * Actualizar datos del usuario
     */
    static async updateUserDetails(id, userData) {
        const { Nombre, Email, Telefono, ID_Sector, ID_Rol } = userData;

        // Verificar si existe el usuario
        await this.getUserById(id);

        const sql = `
            UPDATE USUARIOS 
            SET Nombre = ?, Email = ?, Telefono = ?, ID_Sector = ?, ID_Rol = ?
            WHERE ID_Usuario = ?
        `;
        
        await pool.execute(sql, [Nombre, Email, Telefono, ID_Sector, ID_Rol, id]);

        return { id, ...userData };
    }

    /** * Desactivar un usuario (Borrado Lógico)
     */
    static async deactivateUser(id) {
        // Verificar si existe y está activo
        const user = await this.getUserById(id);
        
        if (user.Activo === 0) {
            const error = new Error('El usuario ya se encuentra inactivo.');
            error.cause = 400;
            throw error;
        }

        const sql = 'UPDATE USUARIOS SET Activo = 0 WHERE ID_Usuario = ?';
        await pool.execute(sql, [id]);

        return { id, status: 'Deactivated' };
    }
}

module.exports = UserService;