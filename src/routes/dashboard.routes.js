// src/routes/dashboard.routes.js
const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth.middleware');
const { pool } = require('../config/db.config');

// idSector real de Dirección General = 1 (verificado contra SECTORES, AuthService.login
// y dashboard.component.ts — CLAUDE.md lo tiene invertido con IT, no confiar en ese doc para esto).
const accesoDireccion = [
    'Administrador',
    'Administrador General',
    'Dirección General',
    '1', 1
];

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

/**
 * GET /api/dashboard/direccion/resumen
 * KPIs de tarjetas del panel de Dirección (puntos 1-5 del pedido original).
 */
router.get('/direccion/resumen', verifyToken, checkRole(accesoDireccion), async (req, res) => {
    try {
        const [
            [[{ activos }]],
            [[{ activosMesAnterior }]],
            [[{ montoActual }]],
            [[{ montoMesAnterior }]],
            [[{ total: totalTecnicos, activosEmpleo, inactivosEmpleo }]],
            [[{ enCampoAhora }]],
            [[{ cantidad: alarmasCriticas }]],
            [[{ finalizadas, total: totalOT }]],
        ] = await Promise.all([
            pool.execute(`SELECT COUNT(*) AS activos FROM ABONADOS WHERE Activo = 1`),
            pool.execute(
                `SELECT COUNT(*) AS activosMesAnterior FROM ABONADOS
                 WHERE Activo = 1 AND FechaAlta <= LAST_DAY(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))`
            ),
            pool.execute(
                `SELECT COALESCE(SUM(Costo), 0) AS montoActual FROM PLANES_CONTRATADOS WHERE EstadoContrato = 'Vigente'`
            ),
            pool.execute(
                `SELECT COALESCE(SUM(Costo), 0) AS montoMesAnterior FROM PLANES_CONTRATADOS
                 WHERE EstadoContrato = 'Vigente' AND FechaInicio <= LAST_DAY(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))`
            ),
            pool.execute(
                `SELECT COUNT(*) AS total, SUM(u.Activo = 1) AS activosEmpleo, SUM(u.Activo = 0) AS inactivosEmpleo
                 FROM USUARIOS u JOIN ROLES r ON u.ID_Rol = r.ID_Rol WHERE r.NombreRol = 'Técnico'`
            ),
            pool.execute(`SELECT COUNT(DISTINCT ID_Tecnico) AS enCampoAhora FROM ASIGNACIONES WHERE Estado = 'En Curso'`),
            pool.execute(
                `SELECT COUNT(*) AS cantidad FROM EVENTOS e
                 JOIN CODIGOS_EVENTOS c ON e.ID_CodigoEvento = c.ID_CodigoEvento
                 WHERE c.Prioridad = 'Crítico' AND e.Estado IN ('Pendiente', 'En Progreso')`
            ),
            pool.execute(`SELECT SUM(Estado = 'Finalizada') AS finalizadas, COUNT(*) AS total FROM ASIGNACIONES`),
        ]);

        const montoActualNum = Number(montoActual);
        const montoMesAnteriorNum = Number(montoMesAnterior);
        const finalizadasNum = Number(finalizadas) || 0;
        const totalOTNum = Number(totalOT) || 0;

        res.status(200).json({
            abonados: {
                activos,
                variacionPorcentual: activosMesAnterior > 0
                    ? Number((((activos - activosMesAnterior) / activosMesAnterior) * 100).toFixed(1))
                    : null,
                periodoComparacion: 'vs cierre de mes anterior (aproximado por FechaAlta)'
            },
            ingresosMensualesEstimados: {
                montoActual: montoActualNum,
                moneda: 'ARS',
                variacionPorcentual: montoMesAnteriorNum > 0
                    ? Number((((montoActualNum - montoMesAnteriorNum) / montoMesAnteriorNum) * 100).toFixed(1))
                    : null,
                periodoComparacion: 'vs cierre de mes anterior (aproximado por FechaInicio)',
                nota: 'Suma de Costo de PLANES_CONTRATADOS Vigentes: ingreso recurrente contratado, no facturación cobrada'
            },
            tecnicos: {
                total: totalTecnicos,
                activosEmpleo: Number(activosEmpleo) || 0,
                inactivosEmpleo: Number(inactivosEmpleo) || 0,
                enCampoAhora
            },
            alarmasCriticas: {
                cantidad: alarmasCriticas,
                criterioPrioridad: ['Crítico']
            },
            otCompletadas: {
                cantidad: finalizadasNum,
                total: totalOTNum,
                porcentaje: totalOTNum > 0 ? Number(((finalizadasNum / totalOTNum) * 100).toFixed(1)) : 0
            }
        });
    } catch (error) {
        console.error('Error al obtener resumen de Dirección:', error);
        res.status(500).json({ message: 'Error al obtener el resumen del panel de Dirección.' });
    }
});

/**
 * GET /api/dashboard/direccion/evolucion-abonados?meses=3|6|12
 * Serie mensual de altas de abonados (punto 6).
 */
router.get('/direccion/evolucion-abonados', verifyToken, checkRole(accesoDireccion), async (req, res) => {
    try {
        const mesesPermitidos = [3, 6, 12];
        const mesesSolicitados = Number(req.query.meses);
        const meses = mesesPermitidos.includes(mesesSolicitados) ? mesesSolicitados : 6;

        const [[{ baseAcumulado }]] = await pool.execute(
            `SELECT COUNT(*) AS baseAcumulado FROM ABONADOS
             WHERE FechaAlta < DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL ? MONTH)`,
            [meses - 1]
        );

        const [filas] = await pool.execute(
            `SELECT DATE_FORMAT(FechaAlta, '%Y-%m') AS periodo, COUNT(*) AS nuevos
             FROM ABONADOS
             WHERE FechaAlta >= DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL ? MONTH)
             GROUP BY periodo`,
            [meses - 1]
        );
        const nuevosPorPeriodo = new Map(filas.map(f => [f.periodo, f.nuevos]));

        const serie = [];
        let acumulado = baseAcumulado;
        const cursor = new Date();
        cursor.setDate(1);
        cursor.setMonth(cursor.getMonth() - (meses - 1));
        for (let i = 0; i < meses; i++) {
            const periodo = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`;
            const nuevos = nuevosPorPeriodo.get(periodo) || 0;
            acumulado += nuevos;
            serie.push({ periodo, nuevos, acumulado });
            cursor.setMonth(cursor.getMonth() + 1);
        }

        res.status(200).json({ meses, serie });
    } catch (error) {
        console.error('Error al obtener evolución de abonados:', error);
        res.status(500).json({ message: 'Error al obtener la evolución de abonados.' });
    }
});

/**
 * GET /api/dashboard/direccion/volumen-eventos
 * Cantidad de EVENTOS por hora en las últimas 24hs (punto 7).
 */
router.get('/direccion/volumen-eventos', verifyToken, checkRole(accesoDireccion), async (req, res) => {
    try {
        const [filas] = await pool.execute(
            `SELECT DATE_FORMAT(FechaHoraRecepcion, '%Y-%m-%d %H:00:00') AS horaBucket, COUNT(*) AS cantidad
             FROM EVENTOS
             WHERE FechaHoraRecepcion >= NOW() - INTERVAL 24 HOUR
             GROUP BY horaBucket`
        );
        const cantidadPorHora = new Map(filas.map(f => [f.horaBucket, f.cantidad]));

        const pad = (n) => String(n).padStart(2, '0');
        const serie = [];
        const cursor = new Date();
        cursor.setMinutes(0, 0, 0);
        cursor.setHours(cursor.getHours() - 23);
        for (let i = 0; i < 24; i++) {
            const clave = `${cursor.getFullYear()}-${pad(cursor.getMonth() + 1)}-${pad(cursor.getDate())} ${pad(cursor.getHours())}:00:00`;
            serie.push({ hora: clave, cantidad: cantidadPorHora.get(clave) || 0 });
            cursor.setHours(cursor.getHours() + 1);
        }

        res.status(200).json({ serie });
    } catch (error) {
        console.error('Error al obtener volumen de eventos:', error);
        res.status(500).json({ message: 'Error al obtener el volumen de eventos.' });
    }
});

/**
 * GET /api/dashboard/direccion/eventos-recientes?limit=10
 * Últimos eventos con su estado derivado para la UI (punto 8).
 */
router.get('/direccion/eventos-recientes', verifyToken, checkRole(accesoDireccion), async (req, res) => {
    try {
        const limiteSolicitado = Number(req.query.limit);
        const limite = Number.isInteger(limiteSolicitado) && limiteSolicitado > 0 && limiteSolicitado <= 50
            ? limiteSolicitado
            : 10;

        const [eventos] = await pool.query(
            `SELECT e.ID_Evento, c.Codigo, c.DescripcionAlarma, c.Prioridad, e.Estado, e.FechaHoraRecepcion, a.RazonSocial
             FROM EVENTOS e
             JOIN CODIGOS_EVENTOS c ON e.ID_CodigoEvento = c.ID_CodigoEvento
             JOIN DISPOSITIVOS d ON e.ID_Dispositivo = d.ID_Dispositivo
             JOIN DIRECCIONES dir ON d.ID_Direccion = dir.ID_Direccion
             JOIN ABONADOS a ON dir.ID_Abonado = a.ID_Abonado
             ORDER BY e.FechaHoraRecepcion DESC
             LIMIT ${limite}`
        );

        const items = eventos.map(ev => ({
            idEvento: ev.ID_Evento,
            codigo: ev.Codigo,
            descripcionAlarma: ev.DescripcionAlarma,
            prioridad: ev.Prioridad,
            estadoEvento: ev.Estado,
            estadoUI: ev.Estado === 'Cerrado' ? 'resuelto' : (ev.Prioridad === 'Crítico' ? 'critico' : 'atencion'),
            fechaHoraRecepcion: ev.FechaHoraRecepcion,
            abonado: ev.RazonSocial,
        }));

        res.status(200).json({ eventos: items });
    } catch (error) {
        console.error('Error al obtener eventos recientes:', error);
        res.status(500).json({ message: 'Error al obtener los eventos recientes.' });
    }
});

module.exports = router;