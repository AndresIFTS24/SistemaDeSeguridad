// src/services/ModeloDispositivoService.js

const { pool } = require('../config/db.config');

const SELECT_MODELO = 'SELECT ID_Modelo, NombreModelo, Fabricante, TipoDispositivo FROM MODELOS_DISPOSITIVOS';

class ModeloDispositivoService {

    /** Crea un nuevo modelo con validación. */
    static async createModelo(data) {
        const { nombreModelo, fabricante, tipoDispositivo } = data;

        if (!nombreModelo || !tipoDispositivo) {
            throw new Error('Faltan campos obligatorios: NombreModelo y TipoDispositivo.', { cause: 400 });
        }

        try {
            const [result] = await pool.execute(
                'INSERT INTO MODELOS_DISPOSITIVOS (NombreModelo, Fabricante, TipoDispositivo) VALUES (?, ?, ?)',
                [nombreModelo, fabricante || null, tipoDispositivo]
            );
            return ModeloDispositivoService.getModeloById(result.insertId);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('El NombreModelo ya está registrado.', { cause: 409 });
            }
            throw error;
        }
    }

    /** Obtiene todos los modelos. */
    static async getAllModelos() {
        const [rows] = await pool.execute(`${SELECT_MODELO} ORDER BY NombreModelo`);
        return rows;
    }

    /** Busca un modelo por ID. */
    static async getModeloById(id) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de modelo debe ser un número válido.', { cause: 400 });
        }

        const [rows] = await pool.execute(`${SELECT_MODELO} WHERE ID_Modelo = ?`, [id]);

        if (rows.length === 0) {
            throw new Error('Modelo de dispositivo no encontrado.', { cause: 404 });
        }
        return rows[0];
    }

    /** Actualiza los datos de un modelo. */
    static async updateModelo(id, data) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de modelo debe ser un número válido.', { cause: 400 });
        }

        const updates = [];
        const params = [];

        if (data.nombreModelo) { updates.push('NombreModelo = ?'); params.push(data.nombreModelo); }
        if (data.fabricante) { updates.push('Fabricante = ?'); params.push(data.fabricante); }
        if (data.tipoDispositivo) { updates.push('TipoDispositivo = ?'); params.push(data.tipoDispositivo); }

        if (updates.length === 0) {
            throw new Error('Se requiere al menos un campo para actualizar.', { cause: 400 });
        }

        try {
            const [result] = await pool.execute(
                `UPDATE MODELOS_DISPOSITIVOS SET ${updates.join(', ')} WHERE ID_Modelo = ?`,
                [...params, id]
            );

            if (result.affectedRows === 0) {
                throw new Error('Modelo no encontrado para actualizar.', { cause: 404 });
            }
            return ModeloDispositivoService.getModeloById(id);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('El NombreModelo ya está siendo utilizado por otro dispositivo.', { cause: 409 });
            }
            throw error;
        }
    }

    /** Elimina físicamente un modelo. */
    static async deleteModelo(id) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de modelo debe ser un número válido.', { cause: 400 });
        }

        try {
            const modelo = await ModeloDispositivoService.getModeloById(id);
            const [result] = await pool.execute('DELETE FROM MODELOS_DISPOSITIVOS WHERE ID_Modelo = ?', [id]);

            if (result.affectedRows === 0) {
                throw new Error('Modelo no encontrado o no pudo ser eliminado.', { cause: 404 });
            }
            return modelo;
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED' || error.code === 'ER_ROW_IS_REFERENCED_2') {
                throw new Error('No se puede eliminar el modelo porque está asociado a dispositivos existentes.', { cause: 409 });
            }
            throw error;
        }
    }
}

module.exports = ModeloDispositivoService;
