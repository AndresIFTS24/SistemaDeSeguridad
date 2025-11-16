// src/routes/modeloDispositivo.routes.js (CORREGIDO)

const express = require('express');
const ModeloDispositivoController = require('../controllers/ModeloDispositivoController');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

// 🚨 CORRECCIÓN: Se agregan los roles para ser consistente (Administrador General)
const adminOnly = [verifyToken, checkRole(['Administrador', 'Administrador General'])];

// Rutas Modelos de Dispositivos (CRUD Completo)
router.post('/modelos', adminOnly, ModeloDispositivoController.create);
router.get('/modelos', adminOnly, ModeloDispositivoController.getAll);
router.get('/modelos/:id', adminOnly, ModeloDispositivoController.getById);
router.put('/modelos/:id', adminOnly, ModeloDispositivoController.update);
router.delete('/modelos/:id', adminOnly, ModeloDispositivoController.softDelete); 

module.exports = router;