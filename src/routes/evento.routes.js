// src/routes/evento.routes.js (CORREGIDO)

const express = require('express');
const EventoController = require('../controllers/EventoController');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

// 🚨 CORRECCIÓN: Usamos 'Administrador General' para ser consistente con el token del usuario.
const adminOnly = [verifyToken, checkRole(['Administrador General'])];

// Rutas Eventos
router.post('/eventos', adminOnly, EventoController.create);
router.get('/eventos', adminOnly, EventoController.getAll);
router.get('/eventos/dispositivo/:id', adminOnly, EventoController.getByDispositivo);
router.get('/eventos/:id', adminOnly, EventoController.getById);
router.put('/eventos/:id', [verifyToken, checkRole(['Administrador General'])], EventoController.updateEstado);
module.exports = router;