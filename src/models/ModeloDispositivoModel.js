// src/models/ModeloDispositivoModel.js

const { executeQuery } = require('../config/db.config');

class ModeloDispositivoModel {
    
    /** Crea un nuevo modelo de dispositivo. */
    static async create({ nombreModelo, fabricante, tipoDispositivo }) {
        const query = `
            INSERT INTO MODELOS_DISPOSITIVOS (NombreModelo, Fabricante, TipoDispositivo)
            OUTPUT INSERTED.ID_Modelo, INSERTED.NombreModelo
            VALUES (?, ?, ?)
        `;
        const params = [nombreModelo, fabricante, tipoDispositivo];
        const result = await executeQuery(query, params);
        return result[0];
    }
    
    /** Obtiene todos los modelos. */
    static async findAll() {
        const query = 'SELECT ID_Modelo, NombreModelo, Fabricante, TipoDispositivo FROM MODELOS_DISPOSITIVOS ORDER BY NombreModelo';
        return executeQuery(query);
    }

    /** Busca un modelo por su ID. */
    static async findById(id) {
        const query = 'SELECT ID_Modelo, NombreModelo, Fabricante, TipoDispositivo FROM MODELOS_DISPOSITIVOS WHERE ID_Modelo = ?';
        const result = await executeQuery(query, [id]);
        return result[0];
    }
    
    /** Actualiza campos de un modelo. */
    static async update(id, updates, params) {
        const query = `
            UPDATE MODELOS_DISPOSITIVOS 
            SET ${updates.join(', ')}
            OUTPUT INSERTED.ID_Modelo, INSERTED.NombreModelo, INSERTED.Fabricante
            WHERE ID_Modelo = ?
        `;
        params.push(id); 
        const result = await executeQuery(query, params);
        return result[0];
    }

    /** Elimina un modelo (Borrado físico, ya que es una tabla de catálogo). */
    static async delete(id) {
        // NOTA: Usa 'DELETE' solo si no tienes FKs apuntando a él, o si sabes que está libre.
        const query = 'DELETE FROM MODELOS_DISPOSITIVOS OUTPUT DELETED.ID_Modelo, DELETED.NombreModelo WHERE ID_Modelo = ?';
        const result = await executeQuery(query, [id]);
        return result[0];
    }
}

module.exports = ModeloDispositivoModel;