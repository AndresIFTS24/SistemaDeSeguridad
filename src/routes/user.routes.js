// src/routes/user.routes.js

const express = require('express');
const UserController = require('../controllers/UserController');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

// Middleware de roles: Corregido para usar el nombre EXACTO del rol de la DB/JWT.
// ¡CRÍTICO!: Cambiado de 'Administrador' a 'Administrador General'
const adminOnly = [verifyToken, checkRole(['Administrador General'])];

// Rutas de Usuarios
// Ruta POST para crear un nuevo usuario. No requiere autenticación si es un registro abierto,
// pero si solo los administradores pueden crear usuarios, debería usar 'adminOnly'.
// ASUMIMOS que solo el ADMIN puede crear usuarios (por el cuerpo JSON que pasaste).
router.post('/users', adminOnly, UserController.register); // Corregido el endpoint de /register a /users

// Rutas protegidas que requieren ser 'Administrador General'
router.get('/users', adminOnly, UserController.getAll);
router.get('/users/active', adminOnly, UserController.getActive);
router.get('/users/:id', adminOnly, UserController.getById);
router.put('/users/:id', adminOnly, UserController.update);
router.delete('/users/:id', adminOnly, UserController.softDelete);



module.exports = router;