// src/models/AsignacionModel.js

const { executeQuery } = require('../config/db.config');

class AsignacionModel {
    
    /** Crea una nueva Orden de Trabajo (OT). */
    static async create({ ID_Direccion, ID_Tecnico, TipoOT, Descripcion, FechaProgramada, Estado = 'Programada' }) {
        const query = `
            INSERT INTO ASIGNACIONES (ID_Direccion, ID_Tecnico, TipoOT, Descripcion, FechaProgramada, Estado)
            OUTPUT 
                INSERTED.ID_Asignacion, INSERTED.ID_Direccion, INSERTED.ID_Tecnico, 
                INSERTED.TipoOT, INSERTED.FechaProgramada
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const params = [ID_Direccion, ID_Tecnico, TipoOT, Descripcion, FechaProgramada, Estado];
        const result = await executeQuery(query, params);
        return result[0];
    }
    
    /** Obtiene todas las Asignaciones/OTs. */
    static async findAll() {
        const query = `
            SELECT 
                A.ID_Asignacion, A.TipoOT, A.Descripcion, A.FechaProgramada, A.Estado,
                A.FechaInicioReal, A.FechaFinReal,
                D.ID_Direccion, D.Calle, D.Numero, 
                U.ID_Usuario AS ID_Tecnico, U.Nombre -- 🚨 SOLO SELECCIONA NOMBRE
            FROM ASIGNACIONES A
            JOIN DIRECCIONES D ON A.ID_Direccion = D.ID_Direccion
            JOIN USUARIOS U ON A.ID_Tecnico = U.ID_Usuario
            ORDER BY A.FechaProgramada DESC
        `;
        return executeQuery(query);
    }

    /** Busca una Asignación/OT por su ID. */
    static async findById(id) {
        const query = `
            SELECT 
                A.ID_Asignacion, A.TipoOT, A.Descripcion, A.FechaProgramada, A.Estado,
                D.ID_Direccion, D.Calle, D.Numero, 
                U.ID_Usuario AS ID_Tecnico, U.Nombre -- 🚨 SOLO SELECCIONA NOMBRE
            FROM ASIGNACIONES A
            JOIN DIRECCIONES D ON A.ID_Direccion = D.ID_Direccion
            JOIN USUARIOS U ON A.ID_Tecnico = U.ID_Usuario
            WHERE A.ID_Asignacion = ?
        `;
        const result = await executeQuery(query, [id]);
        return result[0];
    }

    /** Actualiza campos de una Orden de Trabajo. */
    static async update(id, updates, params) {
        const query = `
            UPDATE ASIGNACIONES 
            SET ${updates.join(', ')}
            OUTPUT INSERTED.ID_Asignacion, INSERTED.TipoOT, INSERTED.Descripcion, INSERTED.FechaProgramada, INSERTED.Estado
            WHERE ID_Asignacion = ?
        `;
        params.push(id); 
        const result = await executeQuery(query, params);
        return result[0];
    }
    
    /** Método de compatibilidad para evitar errores. */
    static async findActiveByDispositivoId(ID_Dispositivo) {
        return null;
    }
    
    /** Finaliza una Orden de Trabajo. */
    static async deactivate(id) {
        const query = `
            UPDATE ASIGNACIONES 
            SET Estado = 'Finalizada', FechaFinReal = GETDATE()
            OUTPUT DELETED.ID_Asignacion, INSERTED.Estado, INSERTED.FechaFinReal
            WHERE ID_Asignacion = ? AND Estado <> 'Programada'
        `;
        const result = await executeQuery(query, [id]);
        return result[0];
    }
}

module.exports = AsignacionModel;