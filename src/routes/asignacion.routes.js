// src/routes/asignacion.routes.js (VERSIÓN FINAL CORREGIDA)

const express = require('express');
const AsignacionController = require('../controllers/AsignacionController');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

// 🚨 CORRECCIÓN: Se agregan los roles para ser consistente
const adminOnly = [verifyToken, checkRole(['Administrador', 'Administrador General'])];

// Rutas Asignaciones/Órdenes de Trabajo (OT)
// Nota: este router se monta en '/api/asignaciones' (ver index.js), por eso
// las rutas internas empiezan en '/' y no repiten el prefijo 'asignaciones'.
router.post('/', adminOnly, AsignacionController.create);
router.get('/', adminOnly, AsignacionController.getAll);
router.get('/:id', adminOnly, AsignacionController.getById);
router.put('/:id', adminOnly, AsignacionController.update);

// Ruta para finalizar una asignación (PUT es para actualizar el estado a "Finalizada")
router.put('/:id/deactivate', adminOnly, AsignacionController.deactivate);

module.exports = router;