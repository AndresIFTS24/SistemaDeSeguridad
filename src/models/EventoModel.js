// src/models/EventoModel.js (CORRECCIÓN FINAL: Adaptando a Objecto de Parámetros @pN)

const { executeQuery } = require('../config/db.config');

/**
 * Convierte un array posicional de valores a un objeto de parámetros nombrados 
 * que espera mssql/db.config.js: { p1: valor1, p2: valor2, ... }
 */
const arrayToNamedParams = (paramsArray) => {
    return paramsArray.reduce((acc, value, index) => {
        // Los placeholders en la query son @p1, @p2, etc.
        acc[`p${index + 1}`] = value; 
        return acc;
    }, {});
};

class EventoModel {
    
    /** * Crea un nuevo evento. */
    static async create({ ID_Dispositivo, ID_CodigoEvento, Estado = 'Pendiente' }) { 
        const query = `
            INSERT INTO EVENTOS (ID_Dispositivo, ID_CodigoEvento, FechaHoraRecepcion, Estado)
            OUTPUT INSERTED.ID_Evento, INSERTED.ID_CodigoEvento, INSERTED.FechaHoraRecepcion
            VALUES (@p1, @p2, GETDATE(), @p3) 
        `;
        const paramsArray = [ID_Dispositivo, ID_CodigoEvento, Estado]; 
        
        // 🚨 CORRECCIÓN: Convertir a objeto nombrado
        const namedParams = arrayToNamedParams(paramsArray); 
        
        const result = await executeQuery(query, namedParams);
        return result[0];
    }
    
    /** * Obtiene todos los eventos. */
    static async findAll() {
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
            ORDER BY E.FechaHoraRecepcion DESC
        `;
        return executeQuery(query, {}); // Se pasa objeto vacío para consistencia
    }

    /** Busca un evento por su ID. */
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
            WHERE E.ID_Evento = @p1 -- <--- Uso de @p1
        `;
        const paramsArray = [id];
        // 🚨 CORRECCIÓN: Convertir a objeto nombrado
        const namedParams = arrayToNamedParams(paramsArray);
        
        const result = await executeQuery(query, namedParams);
        return result[0];
    }

    /** Actualiza el estado de un evento. */
    static async updateEstado(id, estado) {
        const query = `
            UPDATE EVENTOS 
            SET Estado = @p1
            OUTPUT INSERTED.ID_Evento, INSERTED.Estado, INSERTED.FechaHoraRecepcion
            WHERE ID_Evento = @p2 -- <--- Uso de @p2
        `;
        const paramsArray = [estado, id];
        // 🚨 CORRECCIÓN: Convertir a objeto nombrado
        const namedParams = arrayToNamedParams(paramsArray);
        
        const result = await executeQuery(query, namedParams);
        return result[0]; 
    }

    /** Busca eventos por ID de Dispositivo. */
    static async findByDispositivoId(id) {
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
            WHERE E.ID_Dispositivo = @p1 -- <--- Uso de @p1
            ORDER BY E.FechaHoraRecepcion DESC
        `;
        const paramsArray = [id];
        // 🚨 CORRECCIÓN: Convertir a objeto nombrado
        const namedParams = arrayToNamedParams(paramsArray);
        
        const result = await executeQuery(query, namedParams);
        return result; // Devuelve un array de eventos
    }

    /** Elimina un evento. */
    static async delete(id) {
        const query = `
            DELETE FROM EVENTOS 
            OUTPUT DELETED.ID_Evento, DELETED.ID_Dispositivo
            WHERE ID_Evento = @p1 -- <--- Uso de @p1
        `;
        const paramsArray = [id];
        // 🚨 CORRECCIÓN: Convertir a objeto nombrado
        const namedParams = arrayToNamedParams(paramsArray);

        const result = await executeQuery(query, namedParams);
        return result[0]; 
    }
}

module.exports = EventoModel;