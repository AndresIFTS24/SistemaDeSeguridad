// src/routes/evento.routes.js

const express = require('express');
const EventoController = require('../controllers/EventoController');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

// Las rutas de eventos deben ser accesibles por administradores y quizás por usuarios (lectura)
// Usaremos 'adminOnly' por ahora para consistencia, pero podrías definir un rol 'Lector' si fuera necesario.
const adminOnly = [verifyToken, checkRole(['Administrador'])];

// Rutas Eventos
router.post('/eventos', adminOnly, EventoController.create);
router.get('/eventos', adminOnly, EventoController.getAll);
router.get('/eventos/dispositivo/:id', adminOnly, EventoController.getByDispositivo);

// Nota: No se implementan PUT ni DELETE por la naturaleza inmutable de los eventos.

module.exports = router;