const AuthService = require('../services/AuthService');

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
            // LOG PARA DEBUGGING (Mira tu consola de Node si falla)
            console.error('--- ERROR LOGIN ---', error.message);

            const status = error.cause || 500; 
            let message = error.message;

            if (status === 500) {
                message = 'Error interno del servidor.';
            }
            
            return res.status(status).json({ 
                message: message,
                error: error.message 
            });
        }
    }
}

module.exports = AuthController;