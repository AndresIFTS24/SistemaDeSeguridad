// src/controllers/UserController.js

const UserService = require('../services/UserService');

class UserController {
    
    /** POST /api/register */
    static async register(req, res) {
        try {
            const userData = req.body;
            const newUser = await UserService.registerUser(userData);
            
            res.status(201).json({
                message: '✅ Usuario registrado exitosamente.',
                usuario: newUser
            });
        } catch (error) {
            // Manejo de errores específicos (e.g., 409 Conflict por email duplicado, 400 por datos faltantes)
            const status = error.cause === 409 ? 409 : (error.cause === 400 ? 400 : 500);
            const message = status === 409 ? error.message : (status === 400 ? error.message : 'Error interno del servidor al registrar el usuario.');
            
            res.status(status).json({
                message: message,
                error: error.message
            });
        }
    }

    /** GET /api/users */
    static async getAll(req, res) {
        try {
            const users = await UserService.getAllUsers();
            
            res.status(200).json({
                message: `✅ Se encontraron ${users.length} usuarios.`,
                total: users.length,
                usuarios: users
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error interno del servidor al obtener todos los usuarios.',
                error: error.message
            });
        }
    }
    
    /** GET /api/users/active */
    static async getActive(req, res) {
        try {
            const users = await UserService.getActiveUsers();
            
            res.status(200).json({
                message: `✅ Se encontraron ${users.length} usuarios activos.`,
                total: users.length,
                usuarios: users
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error interno del servidor al obtener usuarios activos.',
                error: error.message
            });
        }
    }

    /** GET /api/users/:id */
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const user = await UserService.getUserById(id);
            
            res.status(200).json({
                message: '✅ Usuario encontrado exitosamente.',
                usuario: user
            });
        } catch (error) {
            // Manejo de errores 404 (No encontrado) y 400 (Bad Request)
            const status = error.cause || 500;
            res.status(status).json({
                message: status === 404 ? 'Usuario no encontrado.' : error.message,
                error: error.message
            });
        }
    }

    /** PUT /api/users/:id */
    static async update(req, res) {
        try {
            const { id } = req.params;
            const userData = req.body;
            
            const updatedUser = await UserService.updateUserDetails(id, userData);
            
            res.status(200).json({
                message: `✅ Usuario (ID: ${id}) ha sido actualizado exitosamente.`,
                usuario: updatedUser
            });
        } catch (error) {
            const status = error.cause || 500;
            let message = error.message;

            // Manejo específico de 404 y 400 (Validación de FK o ID)
            if (status === 404) message = 'Usuario no encontrado para actualizar.';
            if (status === 400) message = error.message;

            res.status(status).json({
                message: message,
                error: error.message
            });
        }
    }

    /** DELETE /api/users/:id (Soft Delete) */
    static async softDelete(req, res) {
        try {
            const { id } = req.params;
            const deactivatedUser = await UserService.deactivateUser(id);
            
            res.status(200).json({
                message: `✅ Usuario (ID: ${id}) ha sido desactivado (borrado lógico) exitosamente.`,
                usuario: deactivatedUser
            });
        } catch (error) {
            const status = error.cause || 500;
            let message = error.message;

            if (status === 404) message = 'Usuario no encontrado o ya estaba inactivo.';
            
            res.status(status).json({
                message: message,
                error: error.message
            });
        }
    }
}

module.exports = UserController;