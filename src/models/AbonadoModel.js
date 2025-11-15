// src/models/AbonadoModel.js (Actualización Completa)

const { executeQuery } = require('../config/db.config');

class AbonadoModel {
    
    /** Crea un nuevo abonado. (EXISTENTE) */
    static async create({ razonSocial, rut, contactoPrincipal, telefonoContacto, emailContacto }) {
        const query = `
            INSERT INTO ABONADOS (RazonSocial, RUT, ContactoPrincipal, TelefonoContacto, EmailContacto, Activo)
            OUTPUT INSERTED.ID_Abonado, INSERTED.RazonSocial, INSERTED.RUT
            VALUES (?, ?, ?, ?, ?, 1)
        `;
        const params = [razonSocial, rut, contactoPrincipal, telefonoContacto, emailContacto];
        const result = await executeQuery(query, params);
        return result[0];
    }
    
    /** Obtiene todos los abonados. (EXISTENTE) */
    static async findAll() {
        const query = 'SELECT ID_Abonado, RazonSocial, RUT, ContactoPrincipal, TelefonoContacto, EmailContacto, FechaAlta, Activo FROM ABONADOS ORDER BY RazonSocial';
        return executeQuery(query);
    }

    /** Busca un abonado por su ID. (NUEVO) */
    static async findById(id) {
        const query = `
            SELECT ID_Abonado, RazonSocial, RUT, ContactoPrincipal, TelefonoContacto, EmailContacto, FechaAlta, Activo 
            FROM ABONADOS 
            WHERE ID_Abonado = ?
        `;
        const result = await executeQuery(query, [id]);
        return result[0];
    }
    
    /** Actualiza campos de un abonado. (NUEVO) */
    static async update(id, updates, params) {
        // updates: ['RazonSocial = ?', 'TelefonoContacto = ?'], params: [valorRazon, valorTef, id]
        const query = `
            UPDATE ABONADOS 
            SET ${updates.join(', ')}
            OUTPUT INSERTED.ID_Abonado, INSERTED.RazonSocial, INSERTED.RUT, INSERTED.Activo
            WHERE ID_Abonado = ?
        `;
        
        // El ID debe ser el último parámetro
        params.push(id); 
        const result = await executeQuery(query, params);
        return result[0];
    }

    /** Realiza una eliminación lógica (Soft Delete: Activo = 0). (NUEVO) */
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