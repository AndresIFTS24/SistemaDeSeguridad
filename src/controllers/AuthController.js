// src/controllers/AuthController.js

const AuthService = require('../services/AuthService');

class AuthController {
    
    /** POST /api/login */
    static async login(req, res) {
        const { email, password } = req.body;

        // Nota: La validación de campos obligatorios se maneja mejor en el Servicio
        // para mantener DRY (Don't Repeat Yourself), pero la dejamos aquí como fallback rápido.
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Faltan campos obligatorios: Email y/o contraseña.' 
            });
        }

        try {
            // Pasamos un objeto { email, password } al servicio
            const result = await AuthService.login({ email, password }); 
            
            res.status(200).json({
                message: '✅ Inicio de sesión exitoso. Token generado.',
                token: result.token,
                user: result.user
            });

        } catch (error) {
            // Usamos error.cause para determinar el código de estado (401 Unauthorized, 400 Bad Request, 500 Internal)
            const status = error.cause || 500; 
            
            let message = 'Error interno del servidor durante el login.';

            if (status === 401) {
                 message = 'Error de autenticación: Credenciales inválidas o usuario inactivo.';
            } else if (status === 400) {
                 message = error.message; // Propaga el mensaje específico de validación del servicio
            }
            
            res.status(status).json({ 
                message: message, 
                error: error.message 
            });
        }
    }
}

module.exports = AuthController;