/**
 * Enriquece MODELOS_DISPOSITIVOS con más variedad de catálogo (2 tipos
 * nuevos: Sensor y Sirena, más variantes de Alarma/CCTV/Acceso) y suma
 * STOCK para los modelos nuevos. Los 3 modelos originales no se tocan.
 *
 * Idempotencia por fila, no por tabla: cada modelo se inserta con
 * INSERT IGNORE contra la UNIQUE(NombreModelo), así que correr esto
 * de nuevo no duplica nada aunque parte ya esté cargado.
 *
 * Uso: node scripts/seed-modelos-dispositivos.js
 */

require('dotenv').config();
const { pool } = require('../src/config/db.config');

const NUEVOS_MODELOS = [
    { NombreModelo: 'Panel PowerSeries Neo HS2032', Fabricante: 'DSC', TipoDispositivo: 'Alarma' },
    { NombreModelo: 'Central Vista 128BPT', Fabricante: 'Honeywell', TipoDispositivo: 'Alarma' },
    { NombreModelo: 'StarLink Ajax Hub 2', Fabricante: 'Ajax Systems', TipoDispositivo: 'Alarma' },
    { NombreModelo: 'Cámara Domo IP DS-2CD2143G2', Fabricante: 'Hikvision', TipoDispositivo: 'CCTV' },
    { NombreModelo: 'Cámara Bullet 4MP IPC-HFW2441', Fabricante: 'Dahua', TipoDispositivo: 'CCTV' },
    { NombreModelo: 'Cámara PTZ Autotracking SD6C225', Fabricante: 'Dahua', TipoDispositivo: 'CCTV' },
    { NombreModelo: 'Lector Biométrico ZKTeco SpeedFace V5L', Fabricante: 'ZKTeco', TipoDispositivo: 'Acceso' },
    { NombreModelo: 'Control de Acceso RFID SF400', Fabricante: 'ZKTeco', TipoDispositivo: 'Acceso' },
    { NombreModelo: 'Sensor de Movimiento PIR LC-100', Fabricante: 'Paradox', TipoDispositivo: 'Sensor' },
    { NombreModelo: 'Sensor Rotura de Vidrio GB-500', Fabricante: 'DSC', TipoDispositivo: 'Sensor' },
    { NombreModelo: 'Detector de Humo/Incendio FS-2000', Fabricante: 'Bosch', TipoDispositivo: 'Sensor' },
    { NombreModelo: 'Sensor de Inundación WD-100', Fabricante: 'Honeywell', TipoDispositivo: 'Sensor' },
    { NombreModelo: 'Sirena Exterior Autoalimentada WS4904', Fabricante: 'DSC', TipoDispositivo: 'Sirena' },
    { NombreModelo: 'Sirena Interior Ajax HomeSiren', Fabricante: 'Ajax Systems', TipoDispositivo: 'Sirena' },
];

const UBICACIONES = ['Depósito Central', 'Depósito Norte', 'Camioneta Técnica 1', 'Camioneta Técnica 2', 'Camioneta Técnica 3'];

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

async function main() {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        let insertados = 0;
        const idsInsertados = [];
        for (const m of NUEVOS_MODELOS) {
            const [res] = await conn.execute(
                'INSERT IGNORE INTO MODELOS_DISPOSITIVOS (NombreModelo, Fabricante, TipoDispositivo) VALUES (?, ?, ?)',
                [m.NombreModelo, m.Fabricante, m.TipoDispositivo]
            );
            if (res.affectedRows > 0) {
                insertados++;
                idsInsertados.push(res.insertId);
            }
        }
        console.log(`MODELOS_DISPOSITIVOS: ${insertados} filas nuevas insertadas (de ${NUEVOS_MODELOS.length} intentadas; el resto ya existía).`);

        let stockInsertado = 0;
        for (const idModelo of idsInsertados) {
            const [[{ c: yaTieneStock }]] = await conn.query('SELECT COUNT(*) AS c FROM STOCK WHERE ID_Modelo = ?', [idModelo]);
            if (yaTieneStock > 0) continue;

            const ubicaciones = [...UBICACIONES].sort(() => Math.random() - 0.5).slice(0, enteroAleatorioEntre(2, 3));
            for (const [idx, ubicacion] of ubicaciones.entries()) {
                const cantidad = idx === 0
                    ? enteroAleatorioEntre(10, 35)
                    : elegirPonderado([{ valor: enteroAleatorioEntre(1, 5), peso: 0.35 }, { valor: enteroAleatorioEntre(6, 25), peso: 0.65 }]);
                await conn.execute(
                    'INSERT INTO STOCK (ID_Modelo, Cantidad, UbicacionFisica) VALUES (?, ?, ?)',
                    [idModelo, cantidad, ubicacion]
                );
                stockInsertado++;
            }
        }
        console.log(`STOCK: ${stockInsertado} filas nuevas insertadas para los modelos nuevos.`);

        await conn.commit();
        console.log('\nSeed completado y confirmado (commit).');
    } catch (err) {
        await conn.rollback();
        console.error('Error durante el seed, se hizo rollback.');
        console.error(err);
        process.exitCode = 1;
    } finally {
        conn.release();
        await pool.end();
    }
}

main();
