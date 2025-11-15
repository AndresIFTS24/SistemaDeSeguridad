// src/routes/dispositivo.routes.js

const express = require('express');
const DispositivoController = require('../controllers/DispositivoController');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

// Middleware de seguridad: solo administradores pueden acceder
const adminOnly = [verifyToken, checkRole(['Administrador General'])];

// Rutas Dispositivos (CRUD)

// 1. CREAR (POST)
router.post('/dispositivos', adminOnly, DispositivoController.create);

// 2. OBTENER TODOS (GET /dispositivos)
router.get('/dispositivos', adminOnly, DispositivoController.getAll); 

// 3. OBTENER POR ID (GET /dispositivos/:id) 🚨 ESTA ES LA RUTA QUE FALTABA
router.get('/dispositivos/:id', adminOnly, DispositivoController.getById);

// 4. ACTUALIZAR (PUT)
router.put('/dispositivos/:id', adminOnly, DispositivoController.update);

// 5. ELIMINACIÓN LÓGICA (DELETE)
router.delete('/dispositivos/:id', adminOnly, DispositivoController.softDelete); 
// O si tu controlador usa 'deactivate':
// router.delete('/dispositivos/:id', adminOnly, DispositivoController.deactivate); 

module.exports = router;