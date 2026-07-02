// src/utils/geocoder.js
//
// Geocodificación vía Nominatim (OpenStreetMap) — gratis, sin API key.
// Política de uso de Nominatim: máx. 1 request/seg, User-Agent identificando
// la app, y cachear resultados en vez de volver a pedirlos (por eso este
// módulo NO tiene lógica de rate-limit propia: cada llamada acá es un único
// alta/edición real de un abonado, no un batch. El batch retroactivo
// (scripts/geocodificar-direcciones.js) es responsable de su propio delay
// entre llamadas cuando itera muchas direcciones).

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'OptimusSistemaSeguridad/1.0 (contacto: liliana.respaldar@gmail.com)';
const TIMEOUT_MS = 8000;

/**
 * Geocodifica una dirección argentina vía Nominatim.
 * @returns {Promise<{lat: number, lng: number} | null>} null si no se pudo
 *          resolver (sin resultados, timeout, error de red) — nunca lanza.
 */
async function geocodificar(calle, numero, ciudad) {
    const query = `${calle} ${numero}, ${ciudad}, Argentina`;
    const url = `${NOMINATIM_URL}?format=json&limit=1&q=${encodeURIComponent(query)}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': USER_AGENT },
            signal: controller.signal
        });

        if (!response.ok) {
            console.warn(`⚠️ Geocodificación falló (HTTP ${response.status}) para: "${query}"`);
            return null;
        }

        const resultados = await response.json();
        if (!Array.isArray(resultados) || resultados.length === 0) {
            console.warn(`⚠️ Nominatim no encontró resultados para: "${query}"`);
            return null;
        }

        const lat = parseFloat(resultados[0].lat);
        const lng = parseFloat(resultados[0].lon);
        if (isNaN(lat) || isNaN(lng)) {
            console.warn(`⚠️ Respuesta de Nominatim con coordenadas inválidas para: "${query}"`);
            return null;
        }

        return { lat, lng };
    } catch (error) {
        console.warn(`⚠️ Error al geocodificar "${query}": ${error.message}`);
        return null;
    } finally {
        clearTimeout(timeout);
    }
}

module.exports = { geocodificar };
