// src/controllers/UserController.js
const UserService = require('../services/UserService');

class UserController {
    
    /** POST /api/users */
    static async register(req, res) {
        try {
            const userData = req.body;
            const newUser = await UserService.registerUser(userData);
            
            res.status(201).json({
                message: '✅ Usuario registrado exitosamente.',
                usuario: newUser
            });
        } catch (error) {
            const status = error.cause || 500;
            res.status(status).json({
                message: error.message || 'Error al registrar el usuario.',
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
                message: 'Error al obtener los usuarios.',
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
                message: 'Error al obtener usuarios activos.',
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
                message: `✅ Usuario (ID: ${id}) actualizado exitosamente.`,
                usuario: updatedUser
            });
        } catch (error) {
            const status = error.cause || 500;
            res.status(status).json({
                message: error.message,
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
                message: `✅ Usuario (ID: ${id}) desactivado exitosamente.`,
                usuario: deactivatedUser
            });
        } catch (error) {
            const status = error.cause || 500;
            res.status(status).json({
                message: error.message,
                error: error.message
            });
        }
    }
}

module.exports = UserController;