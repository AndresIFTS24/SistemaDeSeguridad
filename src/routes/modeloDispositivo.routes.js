// src/routes/modeloDispositivo.routes.js (CORREGIDO)

const express = require('express');
const ModeloDispositivoController = require('../controllers/ModeloDispositivoController');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

// Permite Administrador o Administrador General
const adminOnly = [verifyToken, checkRole(['Administrador', 'Administrador General'])];

// Rutas Modelos de Dispositivos (CRUD Completo)
// Nota: este router se monta en '/api/modelos' (ver index.js), por eso las
// rutas internas empiezan en '/' y no repiten el prefijo 'modelos'.
router.post('/', adminOnly, ModeloDispositivoController.create);
router.get('/', adminOnly, ModeloDispositivoController.getAll);
router.get('/:id', adminOnly, ModeloDispositivoController.getById);
router.put('/:id', adminOnly, ModeloDispositivoController.update);
router.delete('/:id', adminOnly, ModeloDispositivoController.delete);

module.exports = router;