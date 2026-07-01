/**
 * Seed de datos de prueba para el panel de Dirección: DISPOSITIVOS + EVENTOS.
 *
 * Prerrequisito para poder generar EVENTOS realistas: hoy solo hay 6 DISPOSITIVOS,
 * atados a 5 de los 101 ABONADOS. Este script primero completa DISPOSITIVOS para
 * los abonados con PLANES_CONTRATADOS (sembrados en scripts/seed-panel-direccion.js)
 * y recién después genera el volumen de EVENTOS.
 *
 * Corre todo en una única transacción: si algo falla, ROLLBACK completo.
 * Idempotencia: los DISPOSITIVOS nuevos se marcan con NumeroSerie 'SEED-DISP-...';
 * si ya existe alguno con ese prefijo, aborta sin insertar nada (evita duplicar
 * el seed si el script se corre dos veces).
 *
 * Uso: node scripts/seed-dispositivos-eventos.js
 */

require('dotenv').config();
const { pool } = require('../src/config/db.config');

const REFERENCIA = new Date('2026-07-01T12:00:00'); // "ahora" para todos los cálculos de fecha
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

function toMySQLDate(fecha) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}`;
}

function primerNombre(razonSocial) {
    return razonSocial.split(/[\s,]+/)[0].replace(/[^A-Za-zÀ-ÿ0-9]/g, '');
}

function generarNumeroSerie(indice) {
    const random = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `SEED-DISP-${String(indice).padStart(4, '0')}-${random}`;
}

const ZONAS_CAMARA = ['Entrada', 'Acceso Vehicular', 'Depósito', 'Perímetro'];

async function main() {
    const conn = await pool.getConnection();
    try {
        // --- Guarda de idempotencia ---
        const [[{ marcados }]] = await conn.query(
            "SELECT COUNT(*) AS marcados FROM DISPOSITIVOS WHERE NumeroSerie LIKE 'SEED-DISP-%'"
        );
        if (marcados > 0) {
            console.log(`Ya hay ${marcados} DISPOSITIVOS marcados como seed ('SEED-DISP-%').`);
            console.log('Abortando para no duplicar. Borrá esos dispositivos (y sus EVENTOS) primero si querés re-sembrar.');
            return;
        }

        await conn.beginTransaction();

        // ------------------------------------------------------------------
        // 0. Catálogos necesarios
        // ------------------------------------------------------------------
        const [modelos] = await conn.query('SELECT ID_Modelo, TipoDispositivo FROM MODELOS_DISPOSITIVOS');
        const modeloPorTipo = {};
        for (const m of modelos) modeloPorTipo[m.TipoDispositivo] = m.ID_Modelo;
        if (!modeloPorTipo['Alarma'] || !modeloPorTipo['CCTV'] || !modeloPorTipo['Acceso']) {
            throw new Error('Faltan modelos base (Alarma/CCTV/Acceso) en MODELOS_DISPOSITIVOS.');
        }

        const [codigos] = await conn.query('SELECT ID_CodigoEvento, Codigo, Prioridad FROM CODIGOS_EVENTOS');
        const codigoPorPrioridad = {};
        for (const c of codigos) codigoPorPrioridad[c.Prioridad] = c.ID_CodigoEvento;
        if (!codigoPorPrioridad['Baja'] || !codigoPorPrioridad['Alta'] || !codigoPorPrioridad['Crítico']) {
            throw new Error('Faltan códigos base (Baja/Alta/Crítico) en CODIGOS_EVENTOS.');
        }

        // ------------------------------------------------------------------
        // 1. DISPOSITIVOS: completar para abonados con PLANES_CONTRATADOS
        // ------------------------------------------------------------------
        const [planes] = await conn.query(
            `SELECT p.ID_Abonado, p.FechaInicio, sb.NombreServicio, a.RazonSocial
             FROM PLANES_CONTRATADOS p
             JOIN SERVICIOS_BASE sb ON p.ID_ServicioBase = sb.ID_ServicioBase
             JOIN ABONADOS a ON p.ID_Abonado = a.ID_Abonado`
        );
        if (planes.length === 0) {
            throw new Error('No hay PLANES_CONTRATADOS. Corré primero scripts/seed-panel-direccion.js.');
        }

        const [direccionesRows] = await conn.query(
            'SELECT ID_Abonado, MIN(ID_Direccion) AS ID_Direccion FROM DIRECCIONES GROUP BY ID_Abonado'
        );
        const direccionPorAbonado = new Map(direccionesRows.map(d => [d.ID_Abonado, d.ID_Direccion]));

        const [dispositivosExistentes] = await conn.query('SELECT ID_Dispositivo, ID_Direccion, ID_Modelo, FechaInstalacion FROM DISPOSITIVOS');
        const dispositivosPorDireccion = new Map();
        for (const d of dispositivosExistentes) {
            if (!dispositivosPorDireccion.has(d.ID_Direccion)) dispositivosPorDireccion.set(d.ID_Direccion, []);
            dispositivosPorDireccion.get(d.ID_Direccion).push(d);
        }

        function tierDe(nombreServicio) {
            if (nombreServicio.includes('Comercial')) return 'Comercial';
            if (nombreServicio.includes('Rondines')) return 'Rondines';
            return 'Residencial';
        }

        const nuevosDispositivos = [];
        let contadorSerie = 1;

        for (const p of planes) {
            const idDireccion = direccionPorAbonado.get(p.ID_Abonado);
            if (!idDireccion) continue; // no debería pasar, pero por si acaso
            const yaTiene = dispositivosPorDireccion.get(idDireccion) || [];
            const nombreCorto = primerNombre(p.RazonSocial);
            const tier = tierDe(p.NombreServicio);
            const fechaBase = new Date(p.FechaInicio);

            if (yaTiene.length === 0) {
                nuevosDispositivos.push({
                    ID_Direccion: idDireccion,
                    ID_Modelo: modeloPorTipo['Alarma'],
                    NumeroSerie: generarNumeroSerie(contadorSerie++),
                    NombreDispositivo: `Panel Principal ${nombreCorto}`,
                    Zona_Ubicacion: 'Entrada Principal',
                    FechaInstalacion: sumarMs(fechaBase, enteroAleatorioEntre(0, 3) * MS_DIA),
                });
            }

            if ((tier === 'Comercial' || tier === 'Rondines') && Math.random() < 0.5) {
                nuevosDispositivos.push({
                    ID_Direccion: idDireccion,
                    ID_Modelo: modeloPorTipo['CCTV'],
                    NumeroSerie: generarNumeroSerie(contadorSerie++),
                    NombreDispositivo: `Cámara ${elegirAlAzar(ZONAS_CAMARA)} ${nombreCorto}`,
                    Zona_Ubicacion: elegirAlAzar(ZONAS_CAMARA),
                    FechaInstalacion: sumarMs(fechaBase, enteroAleatorioEntre(0, 10) * MS_DIA),
                });
            }

            if (tier === 'Rondines' && Math.random() < 0.25) {
                nuevosDispositivos.push({
                    ID_Direccion: idDireccion,
                    ID_Modelo: modeloPorTipo['Acceso'],
                    NumeroSerie: generarNumeroSerie(contadorSerie++),
                    NombreDispositivo: `Lector Biométrico ${nombreCorto}`,
                    Zona_Ubicacion: 'Acceso Peatonal',
                    FechaInstalacion: sumarMs(fechaBase, enteroAleatorioEntre(0, 15) * MS_DIA),
                });
            }
        }

        for (const d of nuevosDispositivos) {
            const [res] = await conn.execute(
                `INSERT INTO DISPOSITIVOS (ID_Direccion, ID_Modelo, NumeroSerie, NombreDispositivo, Zona_Ubicacion, FechaInstalacion, Estado)
                 VALUES (?, ?, ?, ?, ?, ?, 'Operativo')`,
                [d.ID_Direccion, d.ID_Modelo, d.NumeroSerie, d.NombreDispositivo, d.Zona_Ubicacion, toMySQLDate(d.FechaInstalacion)]
            );
            d.ID_Dispositivo = res.insertId;
        }
        console.log(`DISPOSITIVOS: ${nuevosDispositivos.length} filas insertadas (${dispositivosExistentes.length} ya existían).`);

        // Pool completo de dispositivos disponibles para generar EVENTOS
        const modeloTipoPorId = {};
        for (const m of modelos) modeloTipoPorId[m.ID_Modelo] = m.TipoDispositivo;
        const PESO_POR_TIPO = { Alarma: 3, CCTV: 2, Acceso: 1 };

        const poolDispositivos = [
            ...dispositivosExistentes.map(d => ({
                ID_Dispositivo: d.ID_Dispositivo,
                FechaInstalacion: new Date(d.FechaInstalacion),
                peso: PESO_POR_TIPO[modeloTipoPorId[d.ID_Modelo]] || 1,
            })),
            ...nuevosDispositivos.map(d => ({
                ID_Dispositivo: d.ID_Dispositivo,
                FechaInstalacion: d.FechaInstalacion,
                peso: PESO_POR_TIPO[modeloTipoPorId[d.ID_Modelo]] || 1,
            })),
        ];

        function elegirDispositivoParaFecha(techo) {
            const candidatos = poolDispositivos.filter(d => d.FechaInstalacion <= techo);
            if (candidatos.length === 0) return null;
            const totalPeso = candidatos.reduce((acc, d) => acc + d.peso, 0);
            let r = Math.random() * totalPeso;
            for (const d of candidatos) {
                r -= d.peso;
                if (r <= 0) return d;
            }
            return candidatos[candidatos.length - 1];
        }

        // ------------------------------------------------------------------
        // 2. EVENTOS
        // ------------------------------------------------------------------
        function elegirPrioridad() {
            return elegirPonderado([
                { valor: 'Baja', peso: 0.50 },
                { valor: 'Alta', peso: 0.30 },
                { valor: 'Crítico', peso: 0.20 },
            ]);
        }

        function elegirEstado(fecha) {
            const edadMs = REFERENCIA.getTime() - fecha.getTime();
            if (edadMs <= 2 * MS_HORA) {
                return elegirPonderado([
                    { valor: 'Pendiente', peso: 0.70 },
                    { valor: 'En Progreso', peso: 0.25 },
                    { valor: 'Cerrado', peso: 0.05 },
                ]);
            }
            if (edadMs <= MS_DIA) {
                return elegirPonderado([
                    { valor: 'Pendiente', peso: 0.30 },
                    { valor: 'En Progreso', peso: 0.40 },
                    { valor: 'Cerrado', peso: 0.30 },
                ]);
            }
            return elegirPonderado([
                { valor: 'Pendiente', peso: 0.05 },
                { valor: 'En Progreso', peso: 0.15 },
                { valor: 'Cerrado', peso: 0.80 },
            ]);
        }

        const BLOQUES = [
            { piso: sumarMs(REFERENCIA, -MS_DIA), techo: REFERENCIA, cantidad: 35 },
            { piso: sumarMs(REFERENCIA, -7 * MS_DIA), techo: sumarMs(REFERENCIA, -MS_DIA), cantidad: 90 },
            { piso: new Date('2026-01-01T00:00:00'), techo: sumarMs(REFERENCIA, -7 * MS_DIA), cantidad: 525 },
        ];

        const eventosAInsertar = [];
        for (const bloque of BLOQUES) {
            for (let i = 0; i < bloque.cantidad; i++) {
                const dispositivo = elegirDispositivoParaFecha(bloque.techo);
                if (!dispositivo) continue; // no hay dispositivos instalados todavía para este rango
                const piso = dispositivo.FechaInstalacion > bloque.piso ? dispositivo.FechaInstalacion : bloque.piso;
                const fecha = fechaAleatoriaEntre(piso, bloque.techo);
                const prioridad = elegirPrioridad();
                eventosAInsertar.push({
                    ID_Dispositivo: dispositivo.ID_Dispositivo,
                    ID_CodigoEvento: codigoPorPrioridad[prioridad],
                    FechaHoraRecepcion: fecha,
                    Estado: elegirEstado(fecha),
                    prioridad,
                });
            }
        }

        for (const ev of eventosAInsertar) {
            await conn.execute(
                `INSERT INTO EVENTOS (ID_Dispositivo, ID_CodigoEvento, FechaHoraRecepcion, Estado)
                 VALUES (?, ?, ?, ?)`,
                [ev.ID_Dispositivo, ev.ID_CodigoEvento, toMySQLDatetime(ev.FechaHoraRecepcion), ev.Estado]
            );
        }
        console.log(`EVENTOS: ${eventosAInsertar.length} filas insertadas.`);
        {
            const porPrioridad = eventosAInsertar.reduce((acc, e) => { acc[e.prioridad] = (acc[e.prioridad] || 0) + 1; return acc; }, {});
            const porEstado = eventosAInsertar.reduce((acc, e) => { acc[e.Estado] = (acc[e.Estado] || 0) + 1; return acc; }, {});
            console.log('  Por Prioridad:', porPrioridad);
            console.log('  Por Estado:', porEstado);
        }

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
