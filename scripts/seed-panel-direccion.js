/**
 * Seed de datos de prueba para el panel de Dirección.
 * Pobla SERVICIOS_BASE, DIRECCIONES (faltantes), PLANES_CONTRATADOS,
 * ASIGNACIONES y COTIZACIONES a partir de los 101 ABONADOS ya existentes.
 *
 * Corre todo dentro de una única transacción: si algo falla, no queda
 * nada a medio insertar. Aborta sin tocar nada si detecta que alguna
 * de las tablas objetivo ya tiene filas, para evitar sembrar dos veces.
 *
 * Uso: node scripts/seed-panel-direccion.js
 */

require('dotenv').config();
const { pool } = require('../src/config/db.config');

// Fecha de referencia usada como "hoy" para todos los cálculos de fechas
// (coincide con el rango real de FechaAlta de ABONADOS, que llega hasta 2026-06-11).
const HOY = new Date('2026-07-01T00:00:00');

const MS_DIA = 24 * 60 * 60 * 1000;

function sumarDias(fecha, dias) {
    return new Date(fecha.getTime() + dias * MS_DIA);
}

function sumarMeses(fecha, meses) {
    const d = new Date(fecha);
    d.setMonth(d.getMonth() + meses);
    return d;
}

function fechaAleatoriaEntre(desde, hasta) {
    if (hasta <= desde) return new Date(desde);
    const t = desde.getTime() + Math.random() * (hasta.getTime() - desde.getTime());
    return new Date(t);
}

function enteroAleatorioEntre(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
}

function redondear(valor, paso) {
    return Math.round(valor / paso) * paso;
}

function montoAleatorioEntre(min, max, paso = 500) {
    return redondear(min + Math.random() * (max - min), paso);
}

function elegirPonderado(opciones) {
    // opciones: [{ valor, peso }, ...] con pesos que suman ~1
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

function mezclar(lista) {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
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

// --- Catálogos de servicios / precios (ARS, según CEMARA 2026) ---
const SERVICIOS = [
    { nombre: 'Monitoreo 24hs Residencial', costoMin: 55000, costoMax: 75000, peso: 0.45 },
    { nombre: 'Monitoreo 24hs Comercial', costoMin: 75000, costoMax: 120000, peso: 0.35 },
    { nombre: 'Monitoreo + Rondines de Vigilancia', costoMin: 100000, costoMax: 180000, peso: 0.20 },
];

const CIUDADES = ['Buenos Aires', 'La Plata', 'San Isidro', 'Vicente López', 'Quilmes', 'Rosario', 'Córdoba', 'Mar del Plata'];
const CALLES = ['Av. Libertador', 'Av. Corrientes', 'San Martín', 'Belgrano', 'Rivadavia', 'Mitre', 'Sarmiento', 'Av. Santa Fe', 'Alem', '9 de Julio'];

async function main() {
    const conn = await pool.getConnection();
    try {
        // --- Guarda de idempotencia: no sembrar dos veces ---
        const [[{ c: servicios }]] = await conn.query('SELECT COUNT(*) AS c FROM SERVICIOS_BASE');
        const [[{ c: planes }]] = await conn.query('SELECT COUNT(*) AS c FROM PLANES_CONTRATADOS');
        const [[{ c: asignaciones }]] = await conn.query('SELECT COUNT(*) AS c FROM ASIGNACIONES');
        const [[{ c: cotizaciones }]] = await conn.query('SELECT COUNT(*) AS c FROM COTIZACIONES');

        if (servicios > 0 || planes > 0 || asignaciones > 0 || cotizaciones > 0) {
            console.log('Ya hay datos en SERVICIOS_BASE, PLANES_CONTRATADOS, ASIGNACIONES o COTIZACIONES.');
            console.log(`  SERVICIOS_BASE=${servicios} PLANES_CONTRATADOS=${planes} ASIGNACIONES=${asignaciones} COTIZACIONES=${cotizaciones}`);
            console.log('Abortando para no duplicar el seed. Vaciá esas tablas primero si querés re-sembrar.');
            return;
        }

        await conn.beginTransaction();

        // ------------------------------------------------------------------
        // 1. SERVICIOS_BASE
        // ------------------------------------------------------------------
        const servicioIds = {};
        for (const s of SERVICIOS) {
            const [res] = await conn.execute(
                'INSERT INTO SERVICIOS_BASE (NombreServicio, Descripcion) VALUES (?, ?)',
                [s.nombre, `${s.nombre} — datos de prueba`]
            );
            servicioIds[s.nombre] = res.insertId;
        }
        console.log(`SERVICIOS_BASE: ${SERVICIOS.length} filas insertadas.`);

        // ------------------------------------------------------------------
        // 2. DIRECCIONES faltantes (1 por abonado que no tenga ninguna)
        // ------------------------------------------------------------------
        const [abonados] = await conn.query('SELECT ID_Abonado, FechaAlta, Activo FROM ABONADOS');
        const [direccionesExistentes] = await conn.query('SELECT ID_Direccion, ID_Abonado FROM DIRECCIONES');

        const direccionPorAbonado = new Map();
        for (const d of direccionesExistentes) {
            if (!direccionPorAbonado.has(d.ID_Abonado)) direccionPorAbonado.set(d.ID_Abonado, d.ID_Direccion);
        }

        let direccionesInsertadas = 0;
        for (const ab of abonados) {
            if (direccionPorAbonado.has(ab.ID_Abonado)) continue;
            const calle = elegirAlAzar(CALLES);
            const numero = enteroAleatorioEntre(100, 9999);
            const ciudad = elegirAlAzar(CIUDADES);
            const [res] = await conn.execute(
                'INSERT INTO DIRECCIONES (ID_Abonado, Calle, Numero, Ciudad, CoordenadasGPS) VALUES (?, ?, ?, ?, NULL)',
                [ab.ID_Abonado, calle, String(numero), ciudad]
            );
            direccionPorAbonado.set(ab.ID_Abonado, res.insertId);
            direccionesInsertadas++;
        }
        console.log(`DIRECCIONES: ${direccionesInsertadas} filas insertadas (${direccionesExistentes.length} ya existían).`);

        // ------------------------------------------------------------------
        // 3. PLANES_CONTRATADOS (~90 de los abonados Activo=1)
        // ------------------------------------------------------------------
        const activos = mezclar(abonados.filter(a => a.Activo === 1));
        const objetivoPlanes = Math.min(90, activos.length);
        const seleccionados = activos.slice(0, objetivoPlanes);

        const planesGenerados = [];
        for (const ab of seleccionados) {
            const servicio = elegirPonderado(SERVICIOS.map(s => ({ valor: s, peso: s.peso })));
            const fechaAlta = new Date(ab.FechaAlta);
            const fechaInicio = sumarDias(fechaAlta, enteroAleatorioEntre(0, 10));
            const fechaFinPrevista = sumarMeses(fechaInicio, 12);
            const contratoYaVencido = fechaFinPrevista <= HOY;

            const estado = contratoYaVencido
                ? elegirPonderado([
                    { valor: 'Vigente', peso: 0.80 },
                    { valor: 'Vencido', peso: 0.12 },
                    { valor: 'Cancelado', peso: 0.08 },
                ])
                : elegirPonderado([
                    { valor: 'Vigente', peso: 0.92 },
                    { valor: 'Cancelado', peso: 0.08 },
                ]);

            const costo = montoAleatorioEntre(servicio.costoMin, servicio.costoMax);

            const [res] = await conn.execute(
                `INSERT INTO PLANES_CONTRATADOS (ID_Abonado, ID_ServicioBase, FechaInicio, FechaFinPrevista, Costo, EstadoContrato)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [ab.ID_Abonado, servicioIds[servicio.nombre], toMySQLDate(fechaInicio), toMySQLDate(fechaFinPrevista), costo, estado]
            );

            planesGenerados.push({
                ID_PlanContratado: res.insertId,
                ID_Abonado: ab.ID_Abonado,
                ID_Direccion: direccionPorAbonado.get(ab.ID_Abonado),
                servicio: servicio.nombre,
                fechaInicio,
                fechaFinPrevista,
                estado,
            });
        }
        console.log(`PLANES_CONTRATADOS: ${planesGenerados.length} filas insertadas.`);
        {
            const resumen = planesGenerados.reduce((acc, p) => {
                acc[p.estado] = (acc[p.estado] || 0) + 1;
                return acc;
            }, {});
            console.log('  Por EstadoContrato:', resumen);
        }

        // ------------------------------------------------------------------
        // 4. ASIGNACIONES (~230 OT)
        // ------------------------------------------------------------------
        const [tecnicos] = await conn.query(
            `SELECT u.ID_Usuario FROM USUARIOS u JOIN ROLES r ON u.ID_Rol = r.ID_Rol WHERE r.NombreRol = 'Técnico'`
        );
        if (tecnicos.length === 0) throw new Error('No hay usuarios con rol Técnico, no se pueden generar ASIGNACIONES.');
        const tecnicoIds = tecnicos.map(t => t.ID_Usuario);

        const cancelados = planesGenerados.filter(p => p.estado === 'Cancelado');
        const ordenadosPorInicio = [...planesGenerados].sort((a, b) => b.fechaInicio - a.fechaInicio);
        const objetivosInstalacion = ordenadosPorInicio.slice(0, Math.round(planesGenerados.length * 0.52)); // ~47 de 90

        // Elige Estado + fecha coherente entre sí (75% Finalizada / 12% Programada / 13% En Curso)
        function generarEstadoYFechas(pisoFecha) {
            const estado = elegirPonderado([
                { valor: 'Finalizada', peso: 0.75 },
                { valor: 'Programada', peso: 0.12 },
                { valor: 'En Curso', peso: 0.13 },
            ]);

            let fechaProgramada, fechaInicioReal = null, fechaFinReal = null;
            if (estado === 'Programada') {
                fechaProgramada = fechaAleatoriaEntre(HOY, sumarDias(HOY, 21));
            } else if (estado === 'En Curso') {
                fechaProgramada = fechaAleatoriaEntre(sumarDias(HOY, -6), HOY);
                fechaInicioReal = fechaProgramada;
            } else {
                const techo = sumarDias(HOY, -8);
                const piso = pisoFecha < techo ? pisoFecha : sumarDias(techo, -1);
                fechaProgramada = fechaAleatoriaEntre(piso, techo);
                fechaInicioReal = fechaProgramada;
                fechaFinReal = new Date(fechaInicioReal.getTime() + enteroAleatorioEntre(2, 6) * 60 * 60 * 1000);
            }
            return { estado, fechaProgramada, fechaInicioReal, fechaFinReal };
        }

        const otsAInsertar = [];

        // Instalación: una por cada abonado "reciente" seleccionado
        for (const p of objetivosInstalacion) {
            const piso = p.fechaInicio < sumarDias(HOY, -1) ? p.fechaInicio : sumarDias(HOY, -2);
            const { estado, fechaProgramada, fechaInicioReal, fechaFinReal } = generarEstadoYFechas(piso);
            otsAInsertar.push({
                ID_Direccion: p.ID_Direccion,
                ID_Tecnico: elegirAlAzar(tecnicoIds),
                TipoOT: 'Instalación',
                Descripcion: 'Instalación de equipo de seguridad electrónica — datos de prueba',
                FechaProgramada: fechaProgramada,
                FechaInicioReal: fechaInicioReal,
                FechaFinReal: fechaFinReal,
                Estado: estado,
            });
        }

        // Mantenimiento Preventivo + Reparación/Correctivo: repartidos entre todos los planes
        const totalMantenimiento = 176; // ~94 preventivo + ~82 correctivo, ver plan acordado
        for (let i = 0; i < totalMantenimiento; i++) {
            const p = elegirAlAzar(planesGenerados);
            const piso = p.fechaInicio > new Date('2026-01-01') ? p.fechaInicio : new Date('2026-01-01');
            const { estado, fechaProgramada, fechaInicioReal, fechaFinReal } = generarEstadoYFechas(piso);
            const tipo = i < 94 ? 'Mantenimiento Preventivo' : 'Reparación / Mantenimiento Correctivo';
            otsAInsertar.push({
                ID_Direccion: p.ID_Direccion,
                ID_Tecnico: elegirAlAzar(tecnicoIds),
                TipoOT: tipo,
                Descripcion: `${tipo} — datos de prueba`,
                FechaProgramada: fechaProgramada,
                FechaInicioReal: fechaInicioReal,
                FechaFinReal: fechaFinReal,
                Estado: estado,
            });
        }

        // Desinstalación: una por cada plan Cancelado, siempre Finalizada
        for (const p of cancelados) {
            const piso = sumarDias(p.fechaInicio, 30);
            const techo = sumarDias(HOY, -8);
            const fechaProgramada = fechaAleatoriaEntre(piso < techo ? piso : sumarDias(techo, -1), techo);
            const fechaInicioReal = fechaProgramada;
            const fechaFinReal = new Date(fechaInicioReal.getTime() + enteroAleatorioEntre(2, 5) * 60 * 60 * 1000);
            otsAInsertar.push({
                ID_Direccion: p.ID_Direccion,
                ID_Tecnico: elegirAlAzar(tecnicoIds),
                TipoOT: 'Desinstalación',
                Descripcion: 'Retiro de equipo por baja de contrato — datos de prueba',
                FechaProgramada: fechaProgramada,
                FechaInicioReal: fechaInicioReal,
                FechaFinReal: fechaFinReal,
                Estado: 'Finalizada',
            });
        }

        for (const ot of otsAInsertar) {
            await conn.execute(
                `INSERT INTO ASIGNACIONES (ID_Direccion, ID_Tecnico, TipoOT, Descripcion, FechaProgramada, FechaInicioReal, FechaFinReal, Estado)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    ot.ID_Direccion,
                    ot.ID_Tecnico,
                    ot.TipoOT,
                    ot.Descripcion,
                    toMySQLDatetime(ot.FechaProgramada),
                    ot.FechaInicioReal ? toMySQLDatetime(ot.FechaInicioReal) : null,
                    ot.FechaFinReal ? toMySQLDatetime(ot.FechaFinReal) : null,
                    ot.Estado,
                ]
            );
        }
        console.log(`ASIGNACIONES: ${otsAInsertar.length} filas insertadas.`);
        {
            const porTipo = otsAInsertar.reduce((acc, o) => { acc[o.TipoOT] = (acc[o.TipoOT] || 0) + 1; return acc; }, {});
            const porEstado = otsAInsertar.reduce((acc, o) => { acc[o.Estado] = (acc[o.Estado] || 0) + 1; return acc; }, {});
            console.log('  Por TipoOT:', porTipo);
            console.log('  Por Estado:', porEstado);
        }

        // ------------------------------------------------------------------
        // 5. COTIZACIONES (20)
        // ------------------------------------------------------------------
        const [vendedores] = await conn.query(
            `SELECT u.ID_Usuario FROM USUARIOS u JOIN ROLES r ON u.ID_Rol = r.ID_Rol WHERE r.NombreRol = 'Personal de Ventas'`
        );
        if (vendedores.length === 0) throw new Error('No hay usuarios con rol Personal de Ventas, no se pueden generar COTIZACIONES.');
        const vendedorIds = vendedores.map(v => v.ID_Usuario);

        const abonadosConPlan = planesGenerados.map(p => p.ID_Abonado);
        const idsConPlan = new Set(abonadosConPlan);
        const abonadosSinPlan = abonados.filter(a => !idsConPlan.has(a.ID_Abonado)).map(a => a.ID_Abonado);

        const cotizacionesAInsertar = [];
        for (let i = 0; i < 20; i++) {
            let idAbonado;
            if (i < 12 && abonadosSinPlan.length > 0) {
                idAbonado = elegirAlAzar(abonadosSinPlan); // prospecto sin plan
            } else if (i < 18) {
                idAbonado = elegirAlAzar(abonadosConPlan); // upsell/renovación
            } else {
                idAbonado = null; // prospecto frío, sin abonado asociado todavía
            }

            const fechaCotizacion = fechaAleatoriaEntre(new Date('2026-01-01'), HOY);
            const montoTotal = montoAleatorioEntre(90000, 250000, 1000);
            const estado = elegirPonderado([
                { valor: 'Pendiente', peso: 0.40 },
                { valor: 'Aprobada', peso: 0.35 },
                { valor: 'Rechazada', peso: 0.25 },
            ]);

            cotizacionesAInsertar.push({ idAbonado, idVendedor: elegirAlAzar(vendedorIds), fechaCotizacion, montoTotal, estado });
        }

        for (const c of cotizacionesAInsertar) {
            await conn.execute(
                `INSERT INTO COTIZACIONES (ID_Abonado, ID_Vendedor, FechaCotizacion, MontoTotal, Estado)
                 VALUES (?, ?, ?, ?, ?)`,
                [c.idAbonado, c.idVendedor, toMySQLDatetime(c.fechaCotizacion), c.montoTotal, c.estado]
            );
        }
        console.log(`COTIZACIONES: ${cotizacionesAInsertar.length} filas insertadas.`);
        {
            const porEstado = cotizacionesAInsertar.reduce((acc, c) => { acc[c.estado] = (acc[c.estado] || 0) + 1; return acc; }, {});
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
