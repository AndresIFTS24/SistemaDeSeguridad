// src/routes/abonado.routes.js
const express = require('express');
const AbonadoController = require('../controllers/AbonadoController');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * CONFIGURACIÓN DE ROLES
 * Incluimos todas las variantes para que Beatriz (Monitoreo) no sea rebotada.
 */
const accesoLectura = [
    'Administrador General', 
    'Monitoreo', 
    'MONITOREO', 
    'monitoreo', 
    'Administración', 
    'ADMINISTRACION',
    '4', 
    4
];

const accesoEscritura = [
    'Administrador General', 
    'Administración',
    'ADMINISTRACION'
];

// ==========================================
// RUTAS DE CONSULTA (LECTURA)
// ==========================================

/**
 * Obtener todos los abonados
 * IMPORTANTE: Esta ruta debe ir SIEMPRE primero.
 * URL: GET /api/abonados
 */
router.get('/', 
    verifyToken, 
    checkRole(accesoLectura), 
    (req, res, next) => {
        console.log("Ruta GET ALL detectada"); // Log de control
        next();
    },
    AbonadoController.getAll
);

/**
 * Obtener un abonado por ID
 * URL: GET /api/abonados/:id
 */
router.get('/:id', 
    verifyToken, 
    checkRole(accesoLectura), 
    (req, res, next) => {
        console.log("Ruta GET BY ID detectada, ID:", req.params.id); // Log de control
        next();
    },
    AbonadoController.getById
);

// ==========================================
// RUTAS DE EDICIÓN (ESCRITURA)
// ==========================================

/**
 * Crear abonado
 * URL: POST /api/abonados
 */
router.post('/', 
    verifyToken, 
    checkRole(accesoEscritura), 
    AbonadoController.create
);

/**
 * Actualizar abonado
 * URL: PUT /api/abonados/:id
 */
router.put('/:id', 
    verifyToken, 
    checkRole(accesoEscritura), 
    AbonadoController.update
);

/**
 * Borrado lógico (Desactivar)
 * URL: DELETE /api/abonados/:id
 */
router.delete('/:id', 
    verifyToken, 
    checkRole(accesoEscritura), 
    AbonadoController.softDelete
);

module.exports = router;