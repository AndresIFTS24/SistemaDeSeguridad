// src/models/AsignacionModel.js

const { executeQuery } = require('../config/db.config');

class AsignacionModel {
    
    /** Crea una nueva asignación activa. */
    static async create({ ID_Abonado, ID_Dispositivo }) {
        const query = `
            INSERT INTO ASIGNACIONES (ID_Abonado, ID_Dispositivo, FechaAsignacion, Activa)
            OUTPUT INSERTED.ID_Asignacion, INSERTED.ID_Abonado, INSERTED.ID_Dispositivo, INSERTED.FechaAsignacion
            VALUES (?, ?, GETDATE(), 1)
        `;
        const params = [ID_Abonado, ID_Dispositivo];
        const result = await executeQuery(query, params);
        return result[0];
    }
    
    /** Obtiene todas las asignaciones, incluyendo detalles de Abonado y Dispositivo. */
    static async findAll() {
        const query = `
            SELECT 
                A.ID_Asignacion, A.FechaAsignacion, A.FechaDesasignacion, A.Activa,
                AB.ID_Abonado, AB.RazonSocial AS NombreAbonado, 
                D.ID_Dispositivo, D.Serie AS SerieDispositivo, D.NombreDispositivo
            FROM ASIGNACIONES A
            JOIN ABONADOS AB ON A.ID_Abonado = AB.ID_Abonado
            JOIN DISPOSITIVOS D ON A.ID_Dispositivo = D.ID_Dispositivo
            ORDER BY A.FechaAsignacion DESC
        `;
        return executeQuery(query);
    }

    /** Busca una asignación por su ID. */
    static async findById(id) {
        const query = `
            SELECT 
                A.ID_Asignacion, A.FechaAsignacion, A.FechaDesasignacion, A.Activa,
                AB.ID_Abonado, AB.RazonSocial AS NombreAbonado, 
                D.ID_Dispositivo, D.Serie AS SerieDispositivo
            FROM ASIGNACIONES A
            JOIN ABONADOS AB ON A.ID_Abonado = AB.ID_Abonado
            JOIN DISPOSITIVOS D ON A.ID_Dispositivo = D.ID_Dispositivo
            WHERE A.ID_Asignacion = ?
        `;
        const result = await executeQuery(query, [id]);
        return result[0];
    }

    /** Busca si un dispositivo ya tiene una asignación ACTIVA. (Para validación) */
    static async findActiveByDispositivoId(ID_Dispositivo) {
        const query = `
            SELECT ID_Asignacion, ID_Abonado, ID_Dispositivo, Activa
            FROM ASIGNACIONES
            WHERE ID_Dispositivo = ? AND Activa = 1
        `;
        const result = await executeQuery(query, [ID_Dispositivo]);
        return result[0];
    }
    
    /** Desactiva una asignación (establece Activa=0 y FechaDesasignacion). */
    static async deactivate(id) {
        const query = `
            UPDATE ASIGNACIONES 
            SET Activa = 0, FechaDesasignacion = GETDATE()
            OUTPUT DELETED.ID_Asignacion, INSERTED.Activa, INSERTED.FechaDesasignacion
            WHERE ID_Asignacion = ? AND Activa = 1
        `;
        const result = await executeQuery(query, [id]);
        return result[0];
    }
}

module.exports = AsignacionModel;