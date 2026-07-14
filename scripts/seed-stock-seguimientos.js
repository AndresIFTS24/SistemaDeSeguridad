/**
 * Seed de datos de prueba para STOCK y SEGUIMIENTOS_EVENTOS.
 * Ambas tablas están vacías hoy — sin esto, los paneles "Stock por Modelo"
 * (Infraestructura, IT) y "Últimas Acciones de Operadores" (Auditoría, IT)
 * más el MTTA (Resumen Ejecutivo, Dirección) se ven vacíos por falta de
 * dato de origen, no por ningún bug de código.
 *
 * Corre todo en una única transacción: si algo falla, ROLLBACK completo.
 * Idempotencia: aborta sin insertar nada si STOCK o SEGUIMIENTOS_EVENTOS
 * ya tienen filas (mismo criterio que seed-panel-direccion.js).
 *
 * Uso: node scripts/seed-stock-seguimientos.js
 */

require('dotenv').config();
const { pool } = require('../src/config/db.config');

const REFERENCIA = new Date('2026-07-01T12:00:00');
const MS_HORA = 60 * 60 * 1000;
const MS_DIA = 24 * MS_HORA;

function sumarMs(fecha, ms) {
    return new Date(fecha.getTime() + ms);
}

function fechaAleatoriaEntre(desde, hasta) {
    if (hasta <= desde) return new Date(desde);
    return new Date(desde.getTime() + Math.random() * (hasta.getTime() - desde.getTime()));
}

function enteroAleatorioEntre(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
}

function elegirPonderado(opciones) {
    const r = Math.random();
    let acumulado = 0;
    for (const op of opciones) {
        acumulado += op.peso;
        if (r <= acumulado) return op.valor;
    }
    return opciones[opciones.length - 1].valor;
}

function elegirAlAzar(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
}

function toMySQLDatetime(fecha) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())} ` +
        `${pad(fecha.getHours())}:${pad(fecha.getMinutes())}:${pad(fecha.getSeconds())}`;
}

const UBICACIONES = ['Depósito Central', 'Depósito Norte', 'Camioneta Técnica 1', 'Camioneta Técnica 2', 'Camioneta Técnica 3'];

const ACCIONES_ATENCION = [
    'Contacto telefónico con abonado — alarma confirmada como falsa activación',
    'Se verificó imagen de CCTV en tiempo real, sin novedad en el predio',
    'Se despachó técnico a verificar el dispositivo en sitio',
    'Alarma confirmada, se notificó a fuerza de seguridad de la zona',
    'Contacto con abonado — solicita reprogramar sensibilidad del sensor',
    'Se validó código de acceso del titular, evento descartado',
];

const ACCIONES_CIERRE = [
    'Evento cerrado — sin novedad, falsa alarma por mascota',
    'Evento cerrado — técnico confirmó corte de energía en el sector',
    'Evento cerrado — abonado confirmó ingreso autorizado',
    'Evento cerrado tras verificación in situ, sin anomalías',
    'Evento cerrado — batería reemplazada de forma remota vía OT',
];

async function main() {
    const conn = await pool.getConnection();
    try {
        const [[{ c: stockExistente }]] = await conn.query('SELECT COUNT(*) AS c FROM STOCK');
        const [[{ c: seguimientosExistentes }]] = await conn.query('SELECT COUNT(*) AS c FROM SEGUIMIENTOS_EVENTOS');

        if (stockExistente > 0 || seguimientosExistentes > 0) {
            console.log(`Ya hay datos: STOCK=${stockExistente} SEGUIMIENTOS_EVENTOS=${seguimientosExistentes}.`);
            console.log('Abortando para no duplicar el seed. Vaciá esas tablas primero si querés re-sembrar.');
            return;
        }

        await conn.beginTransaction();

        const [modelos] = await conn.query('SELECT ID_Modelo, NombreModelo FROM MODELOS_DISPOSITIVOS');
        if (modelos.length === 0) throw new Error('No hay MODELOS_DISPOSITIVOS, no se puede sembrar STOCK.');

        const stockAInsertar = [];
        for (const modelo of modelos) {
            const ubicacionesElegidas = [...UBICACIONES].sort(() => Math.random() - 0.5).slice(0, enteroAleatorioEntre(3, 4));
            ubicacionesElegidas.forEach((ubicacion, idx) => {
                const cantidad = idx === 0
                    ? enteroAleatorioEntre(15, 40)
                    : elegirPonderado([{ valor: enteroAleatorioEntre(1, 5), peso: 0.4 }, { valor: enteroAleatorioEntre(6, 30), peso: 0.6 }]);
                stockAInsertar.push({ ID_Modelo: modelo.ID_Modelo, Cantidad: cantidad, UbicacionFisica: ubicacion });
            });
        }

        for (const s of stockAInsertar) {
            await conn.execute(
                'INSERT INTO STOCK (ID_Modelo, Cantidad, UbicacionFisica) VALUES (?, ?, ?)',
                [s.ID_Modelo, s.Cantidad, s.UbicacionFisica]
            );
        }
        console.log(`STOCK: ${stockAInsertar.length} filas insertadas.`);
        console.log(`  Críticos (≤5): ${stockAInsertar.filter(s => s.Cantidad <= 5).length}`);

        const [operadores] = await conn.query(
            `SELECT u.ID_Usuario FROM USUARIOS u
             JOIN SECTORES s ON u.ID_Sector = s.ID_Sector
             WHERE s.NombreSector = 'Monitoreo' AND u.Activo = 1`
        );
        if (operadores.length === 0) throw new Error('No hay usuarios activos en el sector Monitoreo, no se pueden generar seguimientos.');
        const operadorIds = operadores.map(o => o.ID_Usuario);

        const [eventos] = await conn.query(
            `SELECT ID_Evento, FechaHoraRecepcion, Estado FROM EVENTOS WHERE Estado IN ('En Progreso', 'Cerrado')`
        );
        if (eventos.length === 0) throw new Error('No hay EVENTOS En Progreso/Cerrado. Corré primero scripts/seed-dispositivos-eventos.js.');

        const seguimientosAInsertar = [];
        for (const ev of eventos) {
            if (Math.random() > 0.70) continue;

            const fechaEvento = new Date(ev.FechaHoraRecepcion);
            const dentroUltimos30 = fechaEvento >= sumarMs(REFERENCIA, -30 * MS_DIA);

            const minAtencion = dentroUltimos30 ? 2 : 8;
            const maxAtencion = dentroUltimos30 ? 8 : 20;
            const fechaAtencion = sumarMs(fechaEvento, enteroAleatorioEntre(minAtencion, maxAtencion) * 60 * 1000);

            seguimientosAInsertar.push({
                ID_Evento: ev.ID_Evento,
                ID_Operador: elegirAlAzar(operadorIds),
                FechaHoraAccion: fechaAtencion,
                AccionRealizada: elegirAlAzar(ACCIONES_ATENCION),
            });

            if (ev.Estado === 'Cerrado') {
                const fechaCierre = sumarMs(fechaAtencion, enteroAleatorioEntre(10, 90) * 60 * 1000);
                seguimientosAInsertar.push({
                    ID_Evento: ev.ID_Evento,
                    ID_Operador: elegirAlAzar(operadorIds),
                    FechaHoraAccion: fechaCierre,
                    AccionRealizada: elegirAlAzar(ACCIONES_CIERRE),
                });
            }
        }

        for (const s of seguimientosAInsertar) {
            await conn.execute(
                `INSERT INTO SEGUIMIENTOS_EVENTOS (ID_Evento, ID_Operador, FechaHoraAccion, AccionRealizada)
                 VALUES (?, ?, ?, ?)`,
                [s.ID_Evento, s.ID_Operador, toMySQLDatetime(s.FechaHoraAccion), s.AccionRealizada]
            );
        }
        console.log(`SEGUIMIENTOS_EVENTOS: ${seguimientosAInsertar.length} filas insertadas (sobre ${eventos.length} eventos elegibles).`);

        await conn.commit();
        console.log('\nSeed completado y confirmado (commit).');
    } catch (err) {
        await conn.rollback();
        console.error('Error durante el seed, se hizo rollback. No quedó nada insertado.');
        console.error(err);
        process.exitCode = 1;
    } finally {
        conn.release();
        await pool.end();
    }
}

main();
