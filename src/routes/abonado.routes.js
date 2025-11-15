// src/routes/abonado.routes.js

const express = require('express');
const AbonadoController = require('../controllers/AbonadoController');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

// Middleware de roles: Corregido para usar el nombre EXACTO del rol del JWT.
// ¡CAMBIO!: De ['Administrador'] a ['Administrador General']
const adminOnly = [verifyToken, checkRole(['Administrador General'])];

// Rutas Abonados (CRUD Completo)
router.post('/abonados', adminOnly, AbonadoController.create);
router.get('/abonados', adminOnly, AbonadoController.getAll);
router.get('/abonados/:id', adminOnly, AbonadoController.getById);
router.put('/abonados/:id', adminOnly, AbonadoController.update);
router.delete('/abonados/:id', adminOnly, AbonadoController.softDelete); 

module.exports = router;