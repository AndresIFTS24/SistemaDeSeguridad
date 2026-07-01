// src/services/AsignacionService.js

const { pool } = require('../config/db.config');

const SELECT_ASIGNACION = `
    SELECT
        A.ID_Asignacion, A.TipoOT, A.Descripcion, A.FechaProgramada, A.Estado,
        A.FechaInicioReal, A.FechaFinReal,
        D.ID_Direccion, D.Calle, D.Numero,
        U.ID_Usuario AS ID_Tecnico, U.Nombre
    FROM ASIGNACIONES A
    JOIN DIRECCIONES D ON A.ID_Direccion = D.ID_Direccion
    JOIN USUARIOS U ON A.ID_Tecnico = U.ID_Usuario
`;

class AsignacionService {

    /** Crea una nueva Orden de Trabajo (OT). */
    static async createAsignacion(data) {
        const { ID_Direccion, ID_Tecnico, TipoOT, Descripcion, FechaProgramada, Estado = 'Programada' } = data;

        if (!ID_Direccion || !ID_Tecnico || !TipoOT || !FechaProgramada) {
            throw new Error('Faltan campos obligatorios: ID_Direccion, ID_Tecnico, TipoOT y FechaProgramada.', { cause: 400 });
        }

        try {
            const [result] = await pool.execute(
                `INSERT INTO ASIGNACIONES (ID_Direccion, ID_Tecnico, TipoOT, Descripcion, FechaProgramada, Estado)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [ID_Direccion, ID_Tecnico, TipoOT, Descripcion || null, FechaProgramada, Estado]
            );
            return AsignacionService.getAsignacionById(result.insertId);
        } catch (error) {
            if (error.code === 'ER_NO_REFERENCED_ROW' || error.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new Error('El ID de Dirección o el ID de Técnico no existen.', { cause: 400 });
            }
            throw error;
        }
    }

    /** Obtiene todas las asignaciones/OTs. */
    static async getAllAsignaciones() {
        const [rows] = await pool.execute(`${SELECT_ASIGNACION} ORDER BY A.FechaProgramada DESC`);
        return rows;
    }

    /** Busca una asignación/OT por ID. */
    static async getAsignacionById(id) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de asignación debe ser un número válido.', { cause: 400 });
        }

        const [rows] = await pool.execute(`${SELECT_ASIGNACION} WHERE A.ID_Asignacion = ?`, [id]);

        if (rows.length === 0) {
            throw new Error('Asignación/Orden de Trabajo no encontrada.', { cause: 404 });
        }
        return rows[0];
    }

    /** Actualiza campos de la OT. */
    static async updateAsignacion(id, data) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de asignación debe ser un número válido.', { cause: 400 });
        }

        const updates = [];
        const params = [];

        if (data.ID_Direccion) { updates.push('ID_Direccion = ?'); params.push(data.ID_Direccion); }
        if (data.ID_Tecnico) { updates.push('ID_Tecnico = ?'); params.push(data.ID_Tecnico); }
        if (data.TipoOT) { updates.push('TipoOT = ?'); params.push(data.TipoOT); }
        if (data.Descripcion) { updates.push('Descripcion = ?'); params.push(data.Descripcion); }
        if (data.FechaProgramada) { updates.push('FechaProgramada = ?'); params.push(data.FechaProgramada); }
        if (data.Estado) { updates.push('Estado = ?'); params.push(data.Estado); }

        if (updates.length === 0) {
            throw new Error('Se requiere al menos un campo para actualizar.', { cause: 400 });
        }

        try {
            const [result] = await pool.execute(
                `UPDATE ASIGNACIONES SET ${updates.join(', ')} WHERE ID_Asignacion = ?`,
                [...params, id]
            );

            if (result.affectedRows === 0) {
                throw new Error('Orden de Trabajo no encontrada para actualizar.', { cause: 404 });
            }
            return AsignacionService.getAsignacionById(id);
        } catch (error) {
            if (error.code === 'ER_NO_REFERENCED_ROW' || error.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new Error('El ID de Dirección o el ID de Técnico no existen.', { cause: 400 });
            }
            throw error;
        }
    }

    /** Finaliza una Orden de Trabajo. */
    static async deactivateAsignacion(id) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de asignación debe ser un número válido.', { cause: 400 });
        }

        const [result] = await pool.execute(
            `UPDATE ASIGNACIONES SET Estado = 'Finalizada', FechaFinReal = NOW()
             WHERE ID_Asignacion = ? AND Estado <> 'Finalizada'`,
            [id]
        );

        if (result.affectedRows === 0) {
            throw new Error('Orden de Trabajo no encontrada o ya estaba finalizada.', { cause: 404 });
        }

        return AsignacionService.getAsignacionById(id);
    }
}

module.exports = AsignacionService;
