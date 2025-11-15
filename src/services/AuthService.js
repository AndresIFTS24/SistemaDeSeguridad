// src/services/AuthService.js

const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../../.env' }); // Mantenemos tu configuración de dotenv

const JWT_SECRET = process.env.JWT_SECRET || 'TuClaveSecretaSuperLargaYCompleja';

class AuthService {

    /**
     * Intenta autenticar un usuario y devuelve un token JWT si las credenciales son válidas.
     * @param {Object} data - Objeto que contiene { email, password }.
     * @returns {Object} { token, user } o lanza un error.
     */
    static async login(data) {
        const { email, password } = data;
        
        // --- 0. Validación de campos obligatorios ---
        if (!email || !password) {
            throw new Error('Email y contraseña son obligatorios.', { cause: 400 });
        }

        // --- 1. Buscar usuario por email (incluye PasswordHash) ---
        // Asumimos que findByEmailForAuth es un método en UserModel que trae el hash y el rol
        const user = await UserModel.findByEmailForAuth(email);

        if (!user) {
            // Usuario no encontrado o error en la consulta
            throw new new Error('Credenciales inválidas.', { cause: 401 }); 
        }

        // --- 2. Verificar si el usuario está inactivo ---
        // Usamos triple igualdad (===) para ser estrictos con el valor booleano o numérico (0/1)
        if (user.Activo === false || user.Activo === 0) {
            throw new Error('Usuario inactivo. Contacte al administrador.', { cause: 401 });
        }

        // --- 3. Comparar la contraseña (hashing) ---
        // El campo del modelo debe ser 'PasswordHash'
        const isMatch = await bcrypt.compare(password, user.PasswordHash);

        if (!isMatch) {
            throw new Error('Credenciales inválidas.', { cause: 401 });
        }
        
        // --- 4. Generar JWT ---
        const token = jwt.sign(
            { 
                id: user.ID_Usuario, 
                email: user.Email, 
                rol: user.NombreRol // Clave 'rol' en minúscula para consistencia
            }, 
            JWT_SECRET, 
            { expiresIn: '1h' } // Token expira en 1 hora
        );

        console.log(`🔑 INICIO DE SESIÓN EXITOSO: Usuario: ${user.Nombre}`);

        // --- 5. Devolver token y datos públicos del usuario ---
        return {
            token: token,
            user: {
                id: user.ID_Usuario,
                nombre: user.Nombre,
                apellido: user.Apellido, // Añadido para ser consistente con el modelo
                rol: user.NombreRol,
                email: user.Email,
                activo: user.Activo
            }
        };
    }
}

module.exports = AuthService;