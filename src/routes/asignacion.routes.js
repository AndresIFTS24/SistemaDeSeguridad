// src/routes/asignacion.routes.js (VERSIÓN FINAL CORREGIDA)

const express = require('express');
const AsignacionController = require('../controllers/AsignacionController');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

// 🚨 CORRECCIÓN: Se agregan los roles para ser consistente
const adminOnly = [verifyToken, checkRole(['Administrador', 'Administrador General'])];

// Rutas Asignaciones/Órdenes de Trabajo (OT)
router.post('/asignaciones', adminOnly, AsignacionController.create);
router.get('/asignaciones', adminOnly, AsignacionController.getAll);
router.get('/asignaciones/:id', adminOnly, AsignacionController.getById);
router.put('/asignaciones/:id', adminOnly, AsignacionController.update);

// Ruta para finalizar una asignación (PUT es para actualizar el estado a "Finalizada")
router.put('/asignaciones/:id/deactivate', adminOnly, AsignacionController.deactivate); 

module.exports = router;