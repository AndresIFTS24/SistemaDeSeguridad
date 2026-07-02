// src/services/AbonadoService.js
const { pool } = require('../config/db.config');
const geocoder = require('../utils/geocoder');

class AbonadoService {

    /**
     * Crear un nuevo abonado + su dirección, en una sola transacción.
     * Un abonado nunca queda sin dirección: si algo falla entre los dos
     * INSERT, se hace rollback completo. La geocodificación en sí nunca
     * bloquea el alta — si Nominatim falla, CoordenadasGPS queda NULL.
     */
    static async createAbonado(data) {
        const { NumeroDeAbonado, RazonSocial, RUT, ContactoPrincipal, TelefonoContacto, EmailContacto, Calle, Numero, Ciudad } = data;

        if (!Calle || !Numero || !Ciudad) {
            const error = new Error('Calle, Número y Ciudad son obligatorios: todo abonado necesita una dirección real para poder responder ante una emergencia.');
            error.cause = 400;
            throw error;
        }

        // 1. Validar si el NumeroDeAbonado o RUT ya existen
        const [existing] = await pool.execute(
            'SELECT NumeroDeAbonado, RUT FROM ABONADOS WHERE NumeroDeAbonado = ? OR (RUT IS NOT NULL AND RUT = ?)',
            [NumeroDeAbonado, RUT || null]
        );

        if (existing.length > 0) {
            const isNro = existing.some(a => a.NumeroDeAbonado === NumeroDeAbonado);
            const error = new Error(isNro ? 'El Número de Abonado ya existe.' : 'El RUT ya se encuentra registrado.');
            error.cause = 409;
            throw error;
        }

        // 2. Geocodificar antes de tomar una conexión de la transacción —
        //    no tiene sentido tener la conexión ocupada mientras esperamos a Nominatim.
        const coords = await geocoder.geocodificar(Calle, Numero, Ciudad);

        // 3. Insertar ABONADOS + DIRECCIONES en una transacción.
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [resultAbonado] = await connection.execute(
                `INSERT INTO ABONADOS (NumeroDeAbonado, RazonSocial, RUT, ContactoPrincipal, TelefonoContacto, EmailContacto, Activo)
                 VALUES (?, ?, ?, ?, ?, ?, 1)`,
                [NumeroDeAbonado, RazonSocial, RUT || null, ContactoPrincipal || null, TelefonoContacto || null, EmailContacto || null]
            );

            const idAbonado = resultAbonado.insertId;

            await connection.execute(
                `INSERT INTO DIRECCIONES (ID_Abonado, Calle, Numero, Ciudad, CoordenadasGPS)
                 VALUES (?, ?, ?, ?, ?)`,
                [idAbonado, Calle, Numero, Ciudad, coords ? `${coords.lat},${coords.lng}` : null]
            );

            await connection.commit();

            return {
                ID_Abonado: idAbonado,
                ...data,
                geocodificado: !!coords
            };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Obtener todos los abonados con su dirección (Ordenados por fecha de alta reciente)
     */
    static async getAllAbonados() {
        const [rows] = await pool.execute(
            `SELECT a.*, d.ID_Direccion, d.Calle, d.Numero, d.Ciudad, d.CoordenadasGPS
             FROM ABONADOS a
             LEFT JOIN DIRECCIONES d ON d.ID_Abonado = a.ID_Abonado
             ORDER BY a.FechaAlta DESC`
        );
        return rows;
    }

    /**
     * Obtener un abonado por ID, con su dirección
     */
    static async getAbonadoById(id) {
        const [rows] = await pool.execute(
            `SELECT a.*, d.ID_Direccion, d.Calle, d.Numero, d.Ciudad, d.CoordenadasGPS
             FROM ABONADOS a
             LEFT JOIN DIRECCIONES d ON d.ID_Abonado = a.ID_Abonado
             WHERE a.ID_Abonado = ?`,
            [id]
        );

        if (rows.length === 0) {
            const error = new Error('Abonado no encontrado.');
            error.cause = 404;
            throw error;
        }
        return rows[0];
    }

    /**
     * Obtener un abonado por su número de cuenta (Muy usado en Monitoreo)
     */
    static async getAbonadoByAccountNumber(nro) {
        const [rows] = await pool.execute('SELECT * FROM ABONADOS WHERE NumeroDeAbonado = ?', [nro]);
        if (rows.length === 0) return null;
        return rows[0];
    }

    /**
     * Actualizar datos del abonado + upsert de su dirección.
     * Solo vuelve a geocodificar si Calle/Número/Ciudad cambiaron respecto
     * a lo ya guardado — evita pedidos innecesarios a Nominatim.
     */
    static async updateAbonado(id, data) {
        const { NumeroDeAbonado, RazonSocial, RUT, ContactoPrincipal, TelefonoContacto, EmailContacto, Activo, Calle, Numero, Ciudad } = data;

        if (!Calle || !Numero || !Ciudad) {
            const error = new Error('Calle, Número y Ciudad son obligatorios: todo abonado necesita una dirección real para poder responder ante una emergencia.');
            error.cause = 400;
            throw error;
        }

        // Trae el abonado actual (con su dirección) para comparar y decidir si re-geocodificar
        const abonadoActual = await this.getAbonadoById(id);

        const direccionCambio = Calle !== abonadoActual.Calle
            || String(Numero) !== String(abonadoActual.Numero)
            || Ciudad !== abonadoActual.Ciudad;

        let coordenadas = abonadoActual.CoordenadasGPS;
        if (direccionCambio) {
            const coords = await geocoder.geocodificar(Calle, Numero, Ciudad);
            coordenadas = coords ? `${coords.lat},${coords.lng}` : null;
        }

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            await connection.execute(
                `UPDATE ABONADOS
                 SET NumeroDeAbonado = ?, RazonSocial = ?, RUT = ?, ContactoPrincipal = ?, TelefonoContacto = ?, EmailContacto = ?, Activo = ?
                 WHERE ID_Abonado = ?`,
                [NumeroDeAbonado, RazonSocial, RUT, ContactoPrincipal, TelefonoContacto, EmailContacto, Activo !== undefined ? Activo : 1, id]
            );

            if (abonadoActual.ID_Direccion) {
                await connection.execute(
                    `UPDATE DIRECCIONES SET Calle = ?, Numero = ?, Ciudad = ?, CoordenadasGPS = ? WHERE ID_Direccion = ?`,
                    [Calle, Numero, Ciudad, coordenadas, abonadoActual.ID_Direccion]
                );
            } else {
                // No debería pasar hoy (todo abonado tiene 1 dirección), pero
                // se cubre por si algún día hay un abonado sin fila en DIRECCIONES.
                await connection.execute(
                    `INSERT INTO DIRECCIONES (ID_Abonado, Calle, Numero, Ciudad, CoordenadasGPS) VALUES (?, ?, ?, ?, ?)`,
                    [id, Calle, Numero, Ciudad, coordenadas]
                );
            }

            await connection.commit();

            return { id, ...data, geocodificado: !!coordenadas };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Alternar estado Activo/Inactivo (Borrado lógico)
     */
    static async toggleStatus(id) {
        const abonado = await this.getAbonadoById(id);
        const nuevoEstado = abonado.Activo === 1 ? 0 : 1;

        await pool.execute('UPDATE ABONADOS SET Activo = ? WHERE ID_Abonado = ?', [nuevoEstado, id]);

        return {
            id,
            activo: nuevoEstado,
            message: nuevoEstado === 1 ? 'Abonado reactivado' : 'Abonado desactivado'
        };
    }

    static async deactivateAbonado(id) {
        const abonado = await this.getAbonadoById(id);

        if (abonado.Activo === 0) {
            const error = new Error('El abonado ya está inactivo.');
            error.cause = 400;
            throw error;
        }

        await pool.execute('UPDATE ABONADOS SET Activo = 0 WHERE ID_Abonado = ?', [id]);

        return { id, activo: 0, message: 'Abonado desactivado exitosamente.' };
    }

    /**
     * Buscar abonados (Para buscadores en el frontend)
     */
    static async searchAbonados(termino) {
        const query = `
            SELECT * FROM ABONADOS
            WHERE RazonSocial LIKE ? OR NumeroDeAbonado LIKE ? OR RUT LIKE ?
            LIMIT 20
        `;
        const t = `%${termino}%`;
        const [rows] = await pool.execute(query, [t, t, t]);
        return rows;
    }
}

module.exports = AbonadoService;
