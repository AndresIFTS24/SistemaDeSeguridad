const express = require('express');
const DispositivoController = require('../controllers/DispositivoController');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

const accesoDispositivos = [
    'Administrador',
    'Administrador General',
    'Dirección General',
    'Jefe Monitoreo',
    'Operario de Monitoreo',
    'Jefe Técnico',
    'Técnico',
    '1', 1, '4', 4, '5', 5
];

router.get('/', verifyToken, checkRole(accesoDispositivos), DispositivoController.getAll);
router.get('/:id', verifyToken, checkRole(accesoDispositivos), DispositivoController.getById);
router.post('/', verifyToken, checkRole(accesoDispositivos), DispositivoController.create);
router.put('/:id', verifyToken, checkRole(accesoDispositivos), DispositivoController.update);
router.delete('/:id', verifyToken, checkRole(accesoDispositivos), DispositivoController.softDelete);

module.exports = router;