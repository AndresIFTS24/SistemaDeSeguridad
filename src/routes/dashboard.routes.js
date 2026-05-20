// src/routes/dashboard.routes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const { pool } = require('../config/db.config');

router.get('/kpis', verifyToken, async (req, res) => {
    try {
        const [[{ totalAbonados }]] = await pool.execute(
            'SELECT COUNT(*) as totalAbonados FROM ABONADOS WHERE Activo = 1'
        );
        const [[{ eventosHoy }]] = await pool.execute(
            `SELECT COUNT(*) as eventosHoy FROM EVENTOS 
             WHERE Estado = 'Pendiente' 
             AND DATE(FechaHoraRecepcion) = CURDATE()`
        );
        const [[{ ticketsAbiertos }]] = await pool.execute(
            `SELECT COUNT(*) as ticketsAbiertos FROM TICKETS_SOPORTE 
             WHERE Estado = 'Abierto'`
        );
        const [[{ tecnicosActivos }]] = await pool.execute(
            `SELECT COUNT(*) as tecnicosActivos FROM USUARIOS 
             WHERE Activo = 1 AND ID_Rol = 8`
        );
        const [[{ asignacionesHoy }]] = await pool.execute(
            `SELECT COUNT(*) as asignacionesHoy FROM ASIGNACIONES 
             WHERE DATE(FechaProgramada) = CURDATE() 
             AND Estado != 'Finalizada'`
        );

        res.status(200).json({
            totalAbonados,
            eventosHoy,
            ticketsAbiertos,
            tecnicosActivos,
            asignacionesHoy
        });
    } catch (error) {
        console.error('Error al obtener KPIs:', error);
        res.status(500).json({ message: 'Error al obtener datos del dashboard.' });
    }
});

module.exports = router;