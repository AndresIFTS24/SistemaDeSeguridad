// src/routes/abonado.routes.js (Actualización Completa)

const express = require('express');
const AbonadoController = require('../controllers/AbonadoController');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

const adminOnly = [verifyToken, checkRole(['Administrador'])];

// Rutas Abonados (CRUD Completo)
router.post('/abonados', adminOnly, AbonadoController.create);
router.get('/abonados', adminOnly, AbonadoController.getAll);
router.get('/abonados/:id', adminOnly, AbonadoController.getById);
router.put('/abonados/:id', adminOnly, AbonadoController.update);
router.delete('/abonados/:id', adminOnly, AbonadoController.softDelete); 

module.exports = router;