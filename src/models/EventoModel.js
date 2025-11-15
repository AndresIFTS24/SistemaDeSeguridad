// src/models/EventoModel.js

const { executeQuery } = require('../config/db.config');

class EventoModel {
    
    /** Crea un nuevo evento, con la fecha actual de SQL Server. */
    static async create({ ID_Dispositivo, TipoEvento, Descripcion, NivelCriticidad }) {
        const query = `
            INSERT INTO EVENTOS (ID_Dispositivo, TipoEvento, Descripcion, NivelCriticidad, FechaHora)
            OUTPUT INSERTED.ID_Evento, INSERTED.TipoEvento, INSERTED.FechaHora
            VALUES (?, ?, ?, ?, GETDATE())
        `;
        const params = [ID_Dispositivo, TipoEvento, Descripcion, NivelCriticidad];
        const result = await executeQuery(query, params);
        return result[0];
    }
    
    /** Obtiene todos los eventos, incluyendo detalles de Dispositivo y Modelo. */
    static async findAll() {
        const query = `
            SELECT 
                E.ID_Evento, E.FechaHora, E.TipoEvento, E.Descripcion, E.NivelCriticidad,
                D.ID_Dispositivo, D.Serie AS SerieDispositivo, D.NombreDispositivo,
                MD.NombreModelo
            FROM EVENTOS E
            JOIN DISPOSITIVOS D ON E.ID_Dispositivo = D.ID_Dispositivo
            JOIN MODELOS_DISPOSITIVOS MD ON D.ID_Modelo = MD.ID_Modelo
            ORDER BY E.FechaHora DESC
        `;
        return executeQuery(query);
    }

    /** Busca eventos por ID de Dispositivo. */
    static async findByDispositivoId(ID_Dispositivo) {
        const query = `
            SELECT 
                E.ID_Evento, E.FechaHora, E.TipoEvento, E.Descripcion, E.NivelCriticidad,
                D.Serie AS SerieDispositivo, D.NombreDispositivo
            FROM EVENTOS E
            JOIN DISPOSITIVOS D ON E.ID_Dispositivo = D.ID_Dispositivo
            WHERE E.ID_Dispositivo = ?
            ORDER BY E.FechaHora DESC
        `;
        return executeQuery(query, [ID_Dispositivo]);
    }
}

module.exports = EventoModel;