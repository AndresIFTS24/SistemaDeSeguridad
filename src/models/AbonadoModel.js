// src/models/AbonadoModel.js (CORREGIDO: Mapeo de campos de entrada)

const { executeQuery } = require('../config/db.config');

class AbonadoModel {
    
    /** * Crea un nuevo abonado. 
     * Nota: Los nombres de los parámetros deben coincidir con las propiedades del objeto 'data'
     * que viene del Service, el cual a su vez viene del req.body.
     */
    static async create({ nombreCompleto, dni, telefono, email }) { // <<-- CAMBIO AQUÍ: Usamos nombres del JSON
        const query = `
            INSERT INTO ABONADOS (RazonSocial, RUT, ContactoPrincipal, TelefonoContacto, EmailContacto, Activo)
            OUTPUT INSERTED.ID_Abonado, INSERTED.RazonSocial, INSERTED.RUT
            VALUES (?, ?, ?, ?, ?, 1)
        `;
        
        // Mapeamos los campos del JSON a los nombres de columna de la DB en el array de parámetros
        const params = [
            nombreCompleto,   // <-- Mapeado a RazonSocial (Parámetro 1)
            dni,              // <-- Mapeado a RUT (Parámetro 2)
            nombreCompleto,   // <-- Mapeado a ContactoPrincipal (Usamos el mismo valor)
            telefono,         // <-- Mapeado a TelefonoContacto
            email             // <-- Mapeado a EmailContacto
        ];
        
        const result = await executeQuery(query, params);
        return result[0];
    }
    
    /** Obtiene todos los abonados. (EXISTENTE) */
    static async findAll() {
        const query = 'SELECT ID_Abonado, RazonSocial, RUT, ContactoPrincipal, TelefonoContacto, EmailContacto, FechaAlta, Activo FROM ABONADOS ORDER BY RazonSocial';
        return executeQuery(query);
    }

    /** Busca un abonado por su ID. (EXISTENTE) */
    static async findById(id) {
        const query = `
            SELECT ID_Abonado, RazonSocial, RUT, ContactoPrincipal, TelefonoContacto, EmailContacto, FechaAlta, Activo 
            FROM ABONADOS 
            WHERE ID_Abonado = ?
        `;
        const result = await executeQuery(query, [id]);
        return result[0];
    }
    
    /** Actualiza campos de un abonado. (EXISTENTE) */
    static async update(id, updates, params) {
        const query = `
            UPDATE ABONADOS 
            SET ${updates.join(', ')}
            OUTPUT INSERTED.ID_Abonado, INSERTED.RazonSocial, INSERTED.RUT, INSERTED.Activo
            WHERE ID_Abonado = ?
        `;
        params.push(id); 
        const result = await executeQuery(query, params);
        return result[0];
    }

    /** Realiza una eliminación lógica (Soft Delete: Activo = 0). (EXISTENTE) */
    static async softDelete(id) {
        const query = `
            UPDATE ABONADOS 
            SET Activo = 0 
            OUTPUT DELETED.ID_Abonado, DELETED.RazonSocial, INSERTED.Activo
            WHERE ID_Abonado = ? AND Activo = 1
        `;
        const result = await executeQuery(query, [id]);
        return result[0];
    }
}

module.exports = AbonadoModel;