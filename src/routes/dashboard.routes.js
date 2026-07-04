// src/routes/dashboard.routes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const { pool } = require('../config/db.config');

// 1. Endpoint de KPIs Actualizado
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
        
        // 🎯 CORRECCIÓN: Ahora cuenta los presupuestos reales de la BD en lugar de tickets_soporte
        const [[{ ticketsAbiertos }]] = await pool.execute(
            `SELECT COUNT(*) as ticketsAbiertos FROM PRESUPUESTOS`
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
            totalAbonados,
            eventosHoy,
            ticketsAbiertos, // Este valor va al KPI de Presupuestos en el Front
            tecnicosActivos,
            asignacionesHoy
        });
    } catch (error) {
        console.error('Error al obtener KPIs:', error);
        res.status(500).json({ message: 'Error al obtener datos del dashboard.' });
    }
});

// 🎯 2. NUEVO ENDPOINT: Trae el listado real de presupuestos para el componente de Angular
router.get('/presupuestos', verifyToken, async (req, res) => {
    try {
        // Hacemos un LEFT JOIN con ABONADOS para traer la RazonSocial real si ID_Abonado existe
        const [rows] = await pool.execute(
            `SELECT 
                p.ID_Presupuesto,
                p.NroPresupuesto,
                p.TipoTrabajo,
                p.ID_Abonado,
                p.Direccion,
                p.Ciudad,
                p.FechaRecepcion,
                p.Estado,
                COALESCE(a.RazonSocial, 'Cliente Nuevo / Potencial') AS RazonSocial,
                COALESCE(a.TelefonoContacto, 'Sin Teléfono') AS TelefonoContacto
             FROM PRESUPUESTOS p
             LEFT JOIN ABONADOS a ON p.ID_Abonado = a.NumeroDeAbonado`
        );

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener listado de presupuestos de la BD:', error);
        res.status(500).json({ message: 'Error al obtener presupuestos comerciales.' });
    }
});

module.exports = router;