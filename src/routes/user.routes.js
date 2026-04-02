// src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// Descomenta estas líneas cuando verifiques que el servidor arranca sin ellas
// const { verifyToken, checkRole } = require('../middleware/auth.middleware');
// const adminOnly = [verifyToken, checkRole(['Administrador General'])];

// Rutas de Usuarios
// Si el servidor falla aquí, es que UserController.metodo no existe.
router.post('/users', UserController.register); 
router.get('/users', UserController.getAll);
router.get('/users/active', UserController.getActive);
router.get('/users/:id', UserController.getById);
router.put('/users/:id', UserController.update);
router.delete('/users/:id', UserController.softDelete);

module.exports = router;