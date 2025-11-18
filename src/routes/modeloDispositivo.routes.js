// src/routes/modeloDispositivo.routes.js (CORREGIDO)

const express = require('express');
const ModeloDispositivoController = require('../controllers/ModeloDispositivoController');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

// Permite Administrador o Administrador General
const adminOnly = [verifyToken, checkRole(['Administrador', 'Administrador General'])];

// Rutas Modelos de Dispositivos (CRUD Completo)
router.post('/modelos', adminOnly, ModeloDispositivoController.create);
router.get('/modelos', adminOnly, ModeloDispositivoController.getAll);
router.get('/modelos/:id', adminOnly, ModeloDispositivoController.getById);
router.put('/modelos/:id', adminOnly, ModeloDispositivoController.update);
// Usamos softDelete que se mapea a ModeloDispositivoController.softDelete
router.delete('/modelos/:id', adminOnly, ModeloDispositivoController.softDelete); 

module.exports = router;