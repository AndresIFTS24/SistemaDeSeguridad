// src/routes/auth.routes.js

const express = require('express');
const AuthController = require('../controllers/AuthController');
// Nota: La ruta de login NO necesita verifyToken ni checkRole.

const router = express.Router();

// Rutas de Autenticación
// POST /api/login: Permite a un usuario obtener un token JWT.
router.post('/login', AuthController.login);

// Si en algún punto se agrega el registro a AuthController:
// router.post('/register', AuthController.register); 

module.exports = router;