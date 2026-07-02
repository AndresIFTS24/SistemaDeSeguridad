/**
 * Geocodificación retroactiva masiva de DIRECCIONES con CoordenadasGPS NULL.
 *
 * Reusa el mismo módulo (src/utils/geocoder.js) que ya usa AbonadoService
 * para las altas/ediciones en tiempo real — una sola implementación del
 * llamado a Nominatim en todo el proyecto.
 *
 * Respeta la política de uso de Nominatim (máx. 1 request/seg): espera
 * 1.1s entre cada llamada. Re-ejecutable sin duplicar trabajo — solo toma
 * las filas que siguen en NULL, así que si se corta a mitad de camino se
 * puede volver a correr y sigue donde quedó.
 *
 * Uso: node scripts/geocodificar-direcciones.js
 */

require('dotenv').config();
const { pool } = require('../src/config/db.config');
const geocoder = require('../src/utils/geocoder');

const DELAY_MS = 1100;

function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const [direcciones] = await pool.query(
        `SELECT ID_Direccion, Calle, Numero, Ciudad
         FROM DIRECCIONES
         WHERE CoordenadasGPS IS NULL OR CoordenadasGPS = ''`
    );

    if (direcciones.length === 0) {
        console.log('No hay direcciones pendientes de geocodificar. Nada que hacer.');
        await pool.end();
        return;
    }

    console.log(`Geocodificando ${direcciones.length} direcciones (≈${Math.ceil(direcciones.length * DELAY_MS / 1000)}s estimados)...\n`);

    let completadas = 0;
    let sinResolver = [];

    for (let i = 0; i < direcciones.length; i++) {
        const d = direcciones[i];
        const etiqueta = `[${i + 1}/${direcciones.length}] ${d.Calle} ${d.Numero}, ${d.Ciudad}`;

        const coords = await geocoder.geocodificar(d.Calle, d.Numero, d.Ciudad);

        if (coords) {
            await pool.execute(
                'UPDATE DIRECCIONES SET CoordenadasGPS = ? WHERE ID_Direccion = ?',
                [`${coords.lat},${coords.lng}`, d.ID_Direccion]
            );
            console.log(`${etiqueta} → OK (${coords.lat},${coords.lng})`);
            completadas++;
        } else {
            console.log(`${etiqueta} → SIN RESOLVER`);
            sinResolver.push(d);
        }

        if (i < direcciones.length - 1) {
            await esperar(DELAY_MS);
        }
    }

    console.log('\n--- Resumen ---');
    console.log(`Completadas: ${completadas}`);
    console.log(`Sin resolver: ${sinResolver.length}`);
    if (sinResolver.length > 0) {
        console.log('Direcciones que Nominatim no pudo resolver:');
        sinResolver.forEach(d => console.log(`  - ID_Direccion ${d.ID_Direccion}: ${d.Calle} ${d.Numero}, ${d.Ciudad}`));
    }

    await pool.end();
}

main().catch(async (err) => {
    console.error('Error en la geocodificación masiva:', err.message);
    await pool.end();
    process.exitCode = 1;
});
