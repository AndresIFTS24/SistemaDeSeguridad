// src/routes/modeloDispositivo.routes.js

const express = require('express');
const ModeloDispositivoController = require('../controllers/ModeloDispositivoController');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

const adminOnly = [verifyToken, checkRole(['Administrador'])];

// Rutas Modelos de Dispositivos (CRUD Completo)
router.post('/modelos', adminOnly, ModeloDispositivoController.create);
router.get('/modelos', adminOnly, ModeloDispositivoController.getAll);
router.get('/modelos/:id', adminOnly, ModeloDispositivoController.getById);
router.put('/modelos/:id', adminOnly, ModeloDispositivoController.update);

// El Controlador ahora debe tener un método 'softDelete' que llama al servicio.
router.delete('/modelos/:id', adminOnly, ModeloDispositivoController.softDelete); 

module.exports = router;