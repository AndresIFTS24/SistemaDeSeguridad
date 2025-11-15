// src/routes/asignacion.routes.js

const express = require('express');
const AsignacionController = require('../controllers/AsignacionController');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

const adminOnly = [verifyToken, checkRole(['Administrador'])];

// Rutas Asignaciones
router.post('/asignaciones', adminOnly, AsignacionController.create);
router.get('/asignaciones', adminOnly, AsignacionController.getAll);
router.get('/asignaciones/:id', adminOnly, AsignacionController.getById);

// Ruta para finalizar una asignación (PUT o DELETE serían válidos, PUT es común para actualizar estado)
router.put('/asignaciones/:id/deactivate', adminOnly, AsignacionController.deactivate); 

module.exports = router;