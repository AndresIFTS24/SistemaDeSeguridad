// src/models/DispositivoModel.js (VERSIÓN FINAL Y COMPLETA CORREGIDA)

const { executeQuery } = require('../config/db.config');

class DispositivoModel {
    
    /** 🔄 Crea un nuevo dispositivo. */
    static async create({ 
        ID_Modelo, 
        Serie, 
        NombreDispositivo, // ❌ ÚNICA VEZ en la destructuración
        Ubicacion, 
        ID_Direccion, 
        FechaInstalacion, 
        Estado = 'Operativo' 
    }) {
        // --- Mapeo y saneamiento de variables ---
        const NumeroSerie = Serie; 
        // ✅ CORRECCIÓN: Usar !Ubicacion para capturar undefined, null, y cadena vacía ("")
        const ZonaUbicacionParam = !Ubicacion ? null : Ubicacion;
        
        const query = `
            -- 🚨 ORDEN ALINEADO Y CORRECCIÓN FINAL
            INSERT INTO DISPOSITIVOS (ID_Modelo, NumeroSerie, NombreDispositivo, Zona_Ubicacion, ID_Direccion, FechaInstalacion, Estado)
            OUTPUT INSERTED.ID_Dispositivo, INSERTED.NumeroSerie, INSERTED.NombreDispositivo
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        // 🚨 ORDEN DE PARÁMETROS: Debe coincidir exactamente con el INSERT de arriba.
        const params = [
            ID_Modelo, 
            NumeroSerie, 
            NombreDispositivo, // 3er Parámetro
            ZonaUbicacionParam, // 4to Parámetro
            ID_Direccion, 
            FechaInstalacion, 
            Estado // 7mo Parámetro
        ];
        
        const result = await executeQuery(query, params);
        return result[0];
    }
    
    /** Obtiene todos los dispositivos (incluyendo detalles del modelo). */
    static async findAll() {
        const query = `
            SELECT 
                D.ID_Dispositivo, D.NumeroSerie, D.NombreDispositivo, D.Zona_Ubicacion, D.FechaInstalacion, D.Estado,
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
                D.ID_Dispositivo, D.NumeroSerie, D.NombreDispositivo, D.Zona_Ubicacion, D.FechaInstalacion, D.Estado,
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
            OUTPUT INSERTED.ID_Dispositivo, INSERTED.NumeroSerie, INSERTED.Estado
            WHERE ID_Dispositivo = ?
        `;
        params.push(id); 
        const result = await executeQuery(query, params);
        return result[0];
    }

    /** Realiza una eliminación lógica (cambio de Estado). */
    static async softDelete(id) {
        const query = `
            UPDATE DISPOSITIVOS 
            SET Estado = 'Inactivo' 
            OUTPUT DELETED.ID_Dispositivo, DELETED.NombreDispositivo, INSERTED.Estado
            WHERE ID_Dispositivo = ? AND Estado = 'Operativo'
        `;
        const result = await executeQuery(query, [id]);
        return result[0];
    }
}

module.exports = DispositivoModel;