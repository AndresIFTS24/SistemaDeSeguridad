// src/routes/tecnica.routes.js
const express = require('express');
const router = express.Router();
const TecnicaController = require('../controllers/TecnicaController');

// Invocamos el método de la clase
router.get('/dashboard-tecnico', TecnicaController.getDashboardTecnico);

module.exports = router;