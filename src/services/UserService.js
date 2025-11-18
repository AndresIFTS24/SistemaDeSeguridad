// src/services/UserService.js

const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');

// Constante para la seguridad del hashing
const SALT_ROUNDS = 10; 

class UserService {
    
    /** Registra un nuevo usuario, hasheando la contraseña. (CORREGIDO: Apellido removido) */
    static async registerUser({ nombre, email, password, telefono, idSector, idRol }) {
        // --- 1. Validaciones básicas ---
        // Se ha removido 'apellido' de la validación
        if (!nombre || !email || !password || !idRol) { 
            throw new Error('Faltan campos obligatorios: Nombre, Email, Contraseña y ID_Rol.', { cause: 400 });
        }
        
        // --- 2. Hashing de la contraseña ---
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        } catch (hashError) {
            console.error('Error al hashear la contraseña:', hashError);
            throw new Error('Error de seguridad al procesar la contraseña.', { cause: 500 });
        }

        // --- 3. Preparar datos para el modelo ---
        const userData = {
            nombre,
            // Apellido eliminado, ya que no existe en la tabla USUARIOS
            email,
            passwordHash: hashedPassword, 
            telefono,
            idSector,
            idRol
        };

        // --- 4. Crear usuario en la DB ---
        try {
            const newUser = await UserModel.create(userData);
            return {
                id: newUser.ID_Usuario,
                nombre: newUser.Nombre,
                email: newUser.Email
            };
        } catch (error) {
            if (error.message && error.message.includes('UNIQUE KEY constraint')) {
                throw new Error('El Email proporcionado ya está registrado.', { cause: 409 });
            }
            if (error.message && error.message.includes('FOREIGN KEY constraint')) {
                throw new Error('El ID de Sector o Rol proporcionado no existe.', { cause: 400 });
            }
            throw error;
        }
    }

    /** Obtiene todos los usuarios. (CORREGIDO: Apellido removido del mapeo) */
    static async getAllUsers() {
        const users = await UserModel.findAll();
        return users.map(user => ({
            id: user.ID_Usuario,
            nombre: user.Nombre,
            // Apellido removido
            email: user.Email,
            activo: user.Activo,
            rol: user.NombreRol,
            sector: user.NombreSector
        }));
    }
    
    /** Obtiene solo usuarios activos. */
    static async getActiveUsers() {
        const users = await UserModel.findActive();
        return users.map(user => ({
            id: user.ID_Usuario,
            nombre: user.Nombre,
            email: user.Email,
            activo: user.Activo,
            rol: user.NombreRol,
            sector: user.NombreSector
        }));
    }

    /** Busca un usuario por ID, si no existe lanza error 404. (CORREGIDO: Apellido removido del retorno) */
    static async getUserById(id) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de usuario debe ser un número válido.', { cause: 400 });
        }
        
        const user = await UserModel.findById(id);

        if (!user) {
            throw new Error('Usuario no encontrado.', { cause: 404 });
        }
        
        return {
            id: user.ID_Usuario,
            nombre: user.Nombre,
            email: user.Email,
            telefono: user.Telefono,
            activo: user.Activo,
            rol: user.NombreRol,
            sector: user.NombreSector,
            idRol: user.ID_Rol,
            idSector: user.ID_Sector
        };
    }
    
    /** Actualiza los datos de un usuario. */
    static async updateUserDetails(id, data) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de usuario debe ser un número válido.', { cause: 400 });
        }
        
        const updates = [];
        const params = [];

        // Hashing de la nueva contraseña (si se proporciona)
        if (data.password) {
            try {
                const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
                updates.push('PasswordHash = ?');
                params.push(hashedPassword);
                // NOTA: Se elimina data.password para no procesarlo más abajo
                delete data.password; 
            } catch (hashError) {
                console.error('Error al hashear la nueva contraseña:', hashError);
                throw new Error('Error de seguridad al procesar la contraseña.', { cause: 500 });
            }
        }
        
        // Mapeo dinámico de campos a actualizar
        const allowedFields = {
            Nombre: 'Nombre', 
            Email: 'Email', 
            Telefono: 'Telefono',
            ID_Sector: 'ID_Sector',
            ID_Rol: 'ID_Rol',
            Activo: 'Activo' // Campo Activo para (des)activación
        };

        for (const [key, dbColumn] of Object.entries(allowedFields)) {
            const value = data[key];
            if (value !== undefined) {
                // Validación para IDs (FKs)
                if (['ID_Sector', 'ID_Rol'].includes(dbColumn) && isNaN(parseInt(value))) {
                    throw new Error(`${dbColumn} debe ser un número válido.`, { cause: 400 });
                }
                // Validación para Activo (debe ser 0 o 1)
                if (dbColumn === 'Activo' && (value !== 0 && value !== 1)) {
                    throw new Error('El campo Activo debe ser 0 o 1.', { cause: 400 });
                }
                
                updates.push(`${dbColumn} = ?`);
                params.push(value);
            }
        }

        if (updates.length === 0) {
            throw new Error('Se requiere al menos un campo válido para actualizar (Nombre, Email, etc., o password).', { cause: 400 });
        }

        try {
            const updatedUser = await UserModel.update(id, updates, params);
            
            if (!updatedUser) {
                throw new Error('Usuario no encontrado para actualizar.', { cause: 404 });
            }
            
            return updatedUser;
        } catch (error) {
            if (error.message.includes('FOREIGN KEY constraint')) {
                throw new Error('El ID de Sector o Rol proporcionado no existe.', { cause: 400 });
            }
            if (error.message.includes('UNIQUE KEY constraint') && error.message.includes('Email')) {
                throw new Error('El Email proporcionado ya está en uso.', { cause: 409 });
            }
            throw error;
        }
    }

    /** Desactiva (soft delete) un usuario. */
    static async deactivateUser(id) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de usuario debe ser un número válido.', { cause: 400 });
        }
        
        const deactivatedUser = await UserModel.softDelete(id);
        
        if (!deactivatedUser) {
            throw new Error('Usuario no encontrado o ya estaba inactivo.', { cause: 404 });
        }

        return deactivatedUser;
    }
}

module.exports = UserService;