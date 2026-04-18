// src/routes/abonado.routes.js
const express = require('express');
const AbonadoController = require('../controllers/AbonadoController');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * CONFIGURACIÓN DE ROLES
 * Lectura: Incluimos variaciones de Monitoreo para asegurar que Beatriz entre.
 * Escritura: Solo personal administrativo.
 */
const accesoLectura = [
    'Administrador General', 
    'Monitoreo', 
    'MONITOREO', 
    'monitoreo', 
    'Administración', 
    '4', 
    4
];

const accesoEscritura = [
    'Administrador General', 
    'Administración'
];

// ==========================================
// RUTAS DE CONSULTA (LECTURA)
// ==========================================

// Obtener todos los abonados
// URL: GET /api/abonados/
router.get('/', 
    verifyToken, 
    checkRole(accesoLectura), 
    AbonadoController.getAll
);

// Obtener un abonado por ID
// URL: GET /api/abonados/:id
router.get('/:id', 
    verifyToken, 
    checkRole(accesoLectura), 
    AbonadoController.getById
);

// ==========================================
// RUTAS DE EDICIÓN (ESCRITURA)
// ==========================================

// Crear abonado
// URL: POST /api/abonados/
router.post('/', 
    verifyToken, 
    checkRole(accesoEscritura), 
    AbonadoController.create
);

// Actualizar abonado
// URL: PUT /api/abonados/:id
router.put('/:id', 
    verifyToken, 
    checkRole(accesoEscritura), 
    AbonadoController.update
);

// Borrado lógico (Desactivar)
// URL: DELETE /api/abonados/:id
router.delete('/:id', 
    verifyToken, 
    checkRole(accesoEscritura), 
    AbonadoController.softDelete
);

module.exports = router;