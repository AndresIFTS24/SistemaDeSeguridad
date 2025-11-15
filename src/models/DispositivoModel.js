// src/models/DispositivoModel.js

const { executeQuery } = require('../config/db.config');

class DispositivoModel {
    
    /** Crea un nuevo dispositivo. */
    static async create({ ID_Modelo, Serie, NombreDispositivo, Ubicacion, Activo = 1 }) {
        const query = `
            INSERT INTO DISPOSITIVOS (ID_Modelo, Serie, NombreDispositivo, Ubicacion, Activo)
            OUTPUT INSERTED.ID_Dispositivo, INSERTED.Serie, INSERTED.NombreDispositivo
            VALUES (?, ?, ?, ?, ?)
        `;
        const params = [ID_Modelo, Serie, NombreDispositivo, Ubicacion, Activo];
        const result = await executeQuery(query, params);
        return result[0];
    }
    
    /** Obtiene todos los dispositivos (incluyendo detalles del modelo). */
    static async findAll() {
        const query = `
            SELECT 
                D.ID_Dispositivo, D.Serie, D.NombreDispositivo, D.Ubicacion, D.FechaInstalacion, D.Activo,
                MD.ID_Modelo, MD.NombreModelo, MD.Fabricante
            FROM DISPOSITIVOS D
            JOIN MODELOS_DISPOSITIVOS MD ON D.ID_Modelo = MD.ID_Modelo
            ORDER BY D.NombreDispositivo
        `;
        return executeQuery(query);
    }

    /** Busca un dispositivo por su ID. */
    static async findById(id) {
        const query = `
            SELECT 
                D.ID_Dispositivo, D.Serie, D.NombreDispositivo, D.Ubicacion, D.FechaInstalacion, D.Activo,
                MD.ID_Modelo, MD.NombreModelo, MD.Fabricante
            FROM DISPOSITIVOS D
            JOIN MODELOS_DISPOSITIVOS MD ON D.ID_Modelo = MD.ID_Modelo
            WHERE D.ID_Dispositivo = ?
        `;
        const result = await executeQuery(query, [id]);
        return result[0];
    }
    
    /** Actualiza campos de un dispositivo. */
    static async update(id, updates, params) {
        const query = `
            UPDATE DISPOSITIVOS 
            SET ${updates.join(', ')}
            OUTPUT INSERTED.ID_Dispositivo, INSERTED.Serie, INSERTED.NombreDispositivo, INSERTED.Activo
            WHERE ID_Dispositivo = ?
        `;
        params.push(id); 
        const result = await executeQuery(query, params);
        return result[0];
    }

    /** Realiza una eliminación lógica (Soft Delete: Activo = 0). */
    static async softDelete(id) {
        const query = `
            UPDATE DISPOSITIVOS 
            SET Activo = 0 
            OUTPUT DELETED.ID_Dispositivo, DELETED.NombreDispositivo, INSERTED.Activo
            WHERE ID_Dispositivo = ? AND Activo = 1
        `;
        const result = await executeQuery(query, [id]);
        return result[0];
    }
}

module.exports = DispositivoModel;