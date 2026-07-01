const AuthService = require('../services/AuthService');
const handleError = require('../utils/errorHandler');

class AuthController {
    static async login(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña requeridos.' });
        }

        try {
            const result = await AuthService.login({ email, password });

            return res.status(200).json({
                message: '✅ Login exitoso',
                token: result.token,
                user: result.user
            });

        } catch (error) {
            handleError(res, error, 'Error interno del servidor.');
        }
    }
}

module.exports = AuthController;