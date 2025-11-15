// src/routes/dispositivo.routes.js

const express = require('express');
const DispositivoController = require('../controllers/DispositivoController');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

const adminOnly = [verifyToken, checkRole(['Administrador'])];

// Rutas Dispositivos (CRUD Completo)
router.post('/dispositivos', adminOnly, DispositivoController.create);
router.get('/dispositivos', adminOnly, DispositivoController.getAll);
router.get('/dispositivos/:id', adminOnly, DispositivoController.getById);
router.put('/dispositivos/:id', adminOnly, DispositivoController.update);
router.delete('/dispositivos/:id', adminOnly, DispositivoController.softDelete); 

module.exports = router;