// src/services/DispositivoService.js
const { pool } = require('../config/db.config');

class DispositivoService {

    /**
     * Registrar un nuevo dispositivo
     */
    static async createDispositivo(data) {
        const { ID_Direccion, ID_Modelo, NumeroSerie, NombreDispositivo, Zona_Ubicacion, FechaInstalacion } = data;

        // 1. Validar si el Número de Serie ya existe
        const [existing] = await pool.execute(
            'SELECT ID_Dispositivo FROM DISPOSITIVOS WHERE NumeroSerie = ?',
            [NumeroSerie]
        );

        if (existing.length > 0) {
            const error = new Error(`El número de serie ${NumeroSerie} ya está registrado.`);
            error.cause = 409;
            throw error;
        }

        // 2. Insertar en MySQL
        const sql = `
            INSERT INTO DISPOSITIVOS 
            (ID_Direccion, ID_Modelo, NumeroSerie, NombreDispositivo, Zona_Ubicacion, FechaInstalacion, Estado) 
            VALUES (?, ?, ?, ?, ?, ?, 'Operativo')
        `;

        const [result] = await pool.execute(sql, [
            ID_Direccion,
            ID_Modelo,
            NumeroSerie,
            NombreDispositivo,
            Zona_Ubicacion || null,
            FechaInstalacion // Debe venir en formato YYYY-MM-DD
        ]);

        return {
            ID_Dispositivo: result.insertId,
            ...data
        };
    }

    /**
     * Obtener todos los dispositivos con detalles de dirección y modelo
     */
    static async getAllDispositivos() {
        const query = `
            SELECT 
                d.ID_Dispositivo, d.NumeroSerie, d.NombreDispositivo, d.Zona_Ubicacion, d.FechaInstalacion, d.Estado,
                dir.Calle, dir.Numero, dir.Ciudad,
                m.NombreModelo, m.Fabricante
            FROM DISPOSITIVOS d
            INNER JOIN DIRECCIONES dir ON d.ID_Direccion = dir.ID_Direccion
            INNER JOIN MODELOS_DISPOSITIVOS m ON d.ID_Modelo = m.ID_Modelo
        `;
        const [rows] = await pool.execute(query);
        return rows;
    }

    /**
     * Obtener un dispositivo por ID
     */
    static async getDispositivoById(id) {
        const query = 'SELECT * FROM DISPOSITIVOS WHERE ID_Dispositivo = ?';
        const [rows] = await pool.execute(query, [id]);

        if (rows.length === 0) {
            const error = new Error('Dispositivo no encontrado.');
            error.cause = 404;
            throw error;
        }
        return rows[0];
    }

    /**
     * Actualizar datos del dispositivo
     */
    static async updateDispositivo(id, data) {
        const { NombreDispositivo, Zona_Ubicacion, Estado } = data;

        // Verificar si existe
        await this.getDispositivoById(id);

        const sql = `
            UPDATE DISPOSITIVOS 
            SET NombreDispositivo = ?, Zona_Ubicacion = ?, Estado = ?
            WHERE ID_Dispositivo = ?
        `;

        await pool.execute(sql, [NombreDispositivo, Zona_Ubicacion, Estado, id]);

        return { id, ...data };
    }

    /**
     * Eliminar dispositivo (Físico o podrías cambiarlo a lógico cambiando el Estado)
     */
    static async deleteDispositivo(id) {
        await this.getDispositivoById(id);
        
        const sql = 'DELETE FROM DISPOSITIVOS WHERE ID_Dispositivo = ?';
        await pool.execute(sql, [id]);

        return { id, message: 'Dispositivo eliminado correctamente.' };
    }
}

module.exports = DispositivoService;