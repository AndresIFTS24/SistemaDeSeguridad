const express = require('express');
const EventoController = require('../controllers/EventoController');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

const accesoEventos = [
    'Administrador',
    'Administrador General',
    'Dirección General',
    'Jefe Monitoreo',
    'Operario de Monitoreo',
    'Monitoreo',
    '1', 1, '4', 4, '5', 5, '9', 9
];

router.get('/', verifyToken, checkRole(accesoEventos), EventoController.getAll);
router.get('/dispositivo/:id', verifyToken, checkRole(accesoEventos), EventoController.getByDispositivo);
router.get('/:id', verifyToken, checkRole(accesoEventos), EventoController.getById);
router.post('/', verifyToken, checkRole(accesoEventos), EventoController.create);
router.put('/:id', verifyToken, checkRole(accesoEventos), EventoController.updateEstado);
router.delete('/:id', verifyToken, checkRole(accesoEventos), EventoController.delete);

module.exports = router;