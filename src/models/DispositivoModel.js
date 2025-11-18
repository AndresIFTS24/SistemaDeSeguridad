// src/models/DispositivoModel.js (VERSIÓN FINAL Y COMPLETA CORREGIDA PARA MSSQL)

const { executeQuery } = require('../config/db.config');

class DispositivoModel {
    
    /** 🔄 Crea un nuevo dispositivo. */
    static async create({ 
        ID_Modelo, 
        Serie, 
        NombreDispositivo, 
        Ubicacion, 
        ID_Direccion, 
        FechaInstalacion, 
        Estado = 'Operativo' 
    }) {
        const NumeroSerie = Serie; 
        const ZonaUbicacionParam = !Ubicacion ? null : Ubicacion; // Mapea indefinido/nulo/vacío a NULL
        
        const query = `
            INSERT INTO DISPOSITIVOS (ID_Modelo, NumeroSerie, NombreDispositivo, Zona_Ubicacion, ID_Direccion, FechaInstalacion, Estado)
            OUTPUT INSERTED.ID_Dispositivo, INSERTED.NumeroSerie, INSERTED.NombreDispositivo
            -- 🚨 CORRECCIÓN: Usar @Nombre
            VALUES (@ID_Modelo, @NumeroSerie, @NombreDispositivo, @Zona_Ubicacion, @ID_Direccion, @FechaInstalacion, @Estado)
        `;
        
        // 🚨 CORRECCIÓN CLAVE: Objeto de parámetros
        const params = {
            ID_Modelo, 
            NumeroSerie, 
            NombreDispositivo,
            Zona_Ubicacion: ZonaUbicacionParam,
            ID_Direccion, 
            FechaInstalacion, 
            Estado
        };
        
        const result = await executeQuery(query, params);
        return result[0];
    }
    
    /** Obtiene todos los dispositivos (incluyendo detalles del modelo). */
    static async findAll() {
        const query = `
            SELECT 
                D.ID_Dispositivo, D.NumeroSerie, D.NombreDispositivo, D.Zona_Ubicacion, D.FechaInstalacion, D.Estado, D.ID_Direccion,
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
                D.ID_Dispositivo, D.NumeroSerie, D.NombreDispositivo, D.Zona_Ubicacion, D.FechaInstalacion, D.Estado, D.ID_Direccion,
                MD.ID_Modelo, MD.NombreModelo, MD.Fabricante
            FROM DISPOSITIVOS D
            JOIN MODELOS_DISPOSITIVOS MD ON D.ID_Modelo = MD.ID_Modelo
            WHERE D.ID_Dispositivo = @ID_Dispositivo -- 🚨 CORRECCIÓN: Usar @ID_Dispositivo
        `;
        // 🚨 CORRECCIÓN CLAVE: Objeto de parámetros
        const result = await executeQuery(query, { ID_Dispositivo: id });
        return result[0];
    }
    
    /** Actualiza campos de un dispositivo. */
    static async update(id, updates, params) {
        // updates: ["NumeroSerie = @NumeroSerie", "Estado = @Estado"]
        // params: { NumeroSerie: '123', Estado: 'Averiado' }
        const query = `
            UPDATE DISPOSITIVOS 
            SET ${updates.join(', ')}
            OUTPUT INSERTED.ID_Dispositivo, INSERTED.NumeroSerie, INSERTED.Estado
            WHERE ID_Dispositivo = @ID_Dispositivo -- 🚨 CORRECCIÓN: Usar @ID_Dispositivo
        `;
        // Agregamos el ID para la cláusula WHERE al objeto de parámetros
        const finalParams = { ...params, ID_Dispositivo: id }; 
        const result = await executeQuery(query, finalParams);
        return result[0];
    }

    /** Realiza una eliminación lógica (cambio de Estado). */
    static async softDelete(id) {
        const query = `
            UPDATE DISPOSITIVOS 
            SET Estado = 'Inactivo' 
            OUTPUT DELETED.ID_Dispositivo, DELETED.NombreDispositivo, INSERTED.Estado
            WHERE ID_Dispositivo = @ID_Dispositivo AND Estado = 'Operativo' -- 🚨 CORRECCIÓN: Usar @ID_Dispositivo
        `;
        // 🚨 CORRECCIÓN CLAVE: Objeto de parámetros
        const result = await executeQuery(query, { ID_Dispositivo: id });
        return result[0];
    }
}

module.exports = DispositivoModel;