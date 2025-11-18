// src/models/EventoModel.js (VERSIÓN CORREGIDA FINAL)

const { executeQuery } = require('../config/db.config');

class EventoModel {
    
    /** * Crea un nuevo evento. 
     * Recibe ID_CodigoEvento.
     */
    static async create({ ID_Dispositivo, ID_CodigoEvento, Estado = 'Pendiente' }) { 
        const query = `
            INSERT INTO EVENTOS (ID_Dispositivo, ID_CodigoEvento, FechaHoraRecepcion, Estado)
            OUTPUT INSERTED.ID_Evento, INSERTED.ID_CodigoEvento, INSERTED.FechaHoraRecepcion
            VALUES (?, ?, GETDATE(), ?)
        `;
        const params = [ID_Dispositivo, ID_CodigoEvento, Estado]; 
        
        const result = await executeQuery(query, params);
        return result[0];
    }
    
    /** * Obtiene todos los eventos, uniendo Dispositivo, Modelo y la descripción 
     * del Código de Evento.
     */
    static async findAll() {
        const query = `
            SELECT 
                E.ID_Evento, E.FechaHoraRecepcion, E.Estado,
                E.ID_Dispositivo, 
                D.NumeroSerie AS SerieDispositivo, 
                D.NombreDispositivo,
                MD.NombreModelo,
                -- 🚨 CORREGIDO: Usamos Codigo, DescripcionAlarma y Prioridad de la tabla CODIGOS_EVENTOS
                CE.Codigo AS TipoEvento, 
                CE.DescripcionAlarma AS DescripcionEvento, 
                CE.Prioridad AS NivelCriticidad
            FROM EVENTOS E
            JOIN DISPOSITIVOS D ON E.ID_Dispositivo = D.ID_Dispositivo
            JOIN MODELOS_DISPOSITIVOS MD ON D.ID_Modelo = MD.ID_Modelo
            JOIN CODIGOS_EVENTOS CE ON E.ID_CodigoEvento = CE.ID_CodigoEvento
            ORDER BY E.FechaHoraRecepcion DESC
        `;
        return executeQuery(query);
    }

    /** Busca eventos por ID de Dispositivo. */
static async findById(id) {
        const query = `
            SELECT 
                E.ID_Evento, E.FechaHoraRecepcion, E.Estado,
                E.ID_Dispositivo, 
                D.NumeroSerie AS SerieDispositivo, 
                D.NombreDispositivo,
                MD.NombreModelo,
                CE.Codigo AS TipoEvento, 
                CE.DescripcionAlarma AS DescripcionEvento, 
                CE.Prioridad AS NivelCriticidad
            FROM EVENTOS E
            JOIN DISPOSITIVOS D ON E.ID_Dispositivo = D.ID_Dispositivo
            JOIN MODELOS_DISPOSITIVOS MD ON D.ID_Modelo = MD.ID_Modelo
            JOIN CODIGOS_EVENTOS CE ON E.ID_CodigoEvento = CE.ID_CodigoEvento
            WHERE E.ID_Evento = ? -- <--- Filtra por ID_Evento
        `;
        const result = await executeQuery(query, [id]);
        return result[0];
    }

    static async updateEstado(id, estado) {
        const query = `
            UPDATE EVENTOS 
            SET Estado = ?
            OUTPUT INSERTED.ID_Evento, INSERTED.Estado, INSERTED.FechaHoraRecepcion
            WHERE ID_Evento = ?
        `;
        const params = [estado, id];
        
        const result = await executeQuery(query, params);
        return result[0]; // Devuelve el evento actualizado
    }

    static async delete(id) {
        const query = `
            DELETE FROM EVENTOS 
            OUTPUT DELETED.ID_Evento, DELETED.ID_Dispositivo
            WHERE ID_Evento = ?
        `;
        const result = await executeQuery(query, [id]);
        return result[0]; // Devuelve el evento eliminado
    }
}

module.exports = EventoModel;