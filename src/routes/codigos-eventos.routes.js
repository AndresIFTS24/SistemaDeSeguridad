const express = require('express');
const router = express.Router();
const { pool } = require('../config/db.config');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', verifyToken, async (req, res) => {
    try {
        console.log('🔍 Consultando códigos de evento...');
        console.log('Usuario:', req.user);
        
        const [rows] = await pool.execute(
            'SELECT ID_CodigoEvento, Codigo, DescripcionAlarma, Prioridad FROM CODIGOS_EVENTOS'
        );
        
        console.log('✅ Códigos encontrados:', rows.length);
        
        res.status(200).json({
            message: `✅ Se encontraron ${rows.length} códigos de evento.`,
            total: rows.length,
            codigos: rows
        });
    } catch (error) {
        console.error('❌ Error en codigos-eventos:', error);
        res.status(500).json({ message: 'Error al obtener códigos de evento.', error: error.message });
    }
});

module.exports = router;