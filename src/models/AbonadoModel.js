// src/models/AbonadoModel.js (COMPLETO Y CORREGIDO PARA MSSQL)

const { executeQuery } = require('../config/db.config');

class AbonadoModel {
    
    /** * Crea un nuevo abonado. 
     * Espera los parámetros mapeados desde el Service con nombres de columna de DB.
     */
    static async create({ RazonSocial, RUT, ContactoPrincipal, TelefonoContacto, EmailContacto, ID_Zona }) {
        const query = `
            INSERT INTO ABONADOS (RazonSocial, RUT, ContactoPrincipal, TelefonoContacto, EmailContacto, ID_Zona, Activo)
            OUTPUT INSERTED.ID_Abonado, INSERTED.RazonSocial, INSERTED.RUT
            VALUES (@RazonSocial, @RUT, @ContactoPrincipal, @TelefonoContacto, @EmailContacto, @ID_Zona, 1)
        `;
        
        const params = {
            RazonSocial,
            RUT,
            ContactoPrincipal,
            TelefonoContacto,
            EmailContacto,
            ID_Zona
        };
        
        const result = await executeQuery(query, params);
        return result[0];
    }
    
    /** Obtiene todos los abonados. */
    static async findAll() {
        const query = 'SELECT ID_Abonado, RazonSocial, RUT, ContactoPrincipal, TelefonoContacto, EmailContacto, FechaAlta, Activo FROM ABONADOS ORDER BY RazonSocial';
        return executeQuery(query);
    }

    /** Busca un abonado por su ID. */
    static async findById(id) {
        const query = `
            SELECT ID_Abonado, RazonSocial, RUT, ContactoPrincipal, TelefonoContacto, EmailContacto, FechaAlta, Activo 
            FROM ABONADOS 
            WHERE ID_Abonado = @ID_Abonado -- 🚨 CORRECCIÓN: Usar @ID_Abonado
        `;
        const result = await executeQuery(query, { ID_Abonado: id }); // Parámetro como objeto
        return result[0];
    }
    
    /** Actualiza campos de un abonado. */
    static async update(id, updates, params) {
        // updates es un array de strings (ej: ["RazonSocial = @RazonSocial"])
        const query = `
            UPDATE ABONADOS 
            SET ${updates.join(', ')}
            OUTPUT INSERTED.ID_Abonado, INSERTED.RazonSocial, INSERTED.RUT, INSERTED.Activo -- Corregido a campos de ABONADOS
            WHERE ID_Abonado = @ID_Abonado 
        `;
        
        // Agregamos el ID para la cláusula WHERE al objeto de parámetros
        const finalParams = { ...params, ID_Abonado: id }; 
        
        const result = await executeQuery(query, finalParams);
        return result[0];
    }

    /** Realiza una eliminación lógica (Soft Delete: Activo = 0). */
    static async softDelete(id) {
        const query = `
            UPDATE ABONADOS 
            SET Activo = 0 
            OUTPUT DELETED.ID_Abonado, DELETED.RazonSocial, INSERTED.Activo
            WHERE ID_Abonado = @ID_Abonado AND Activo = 1 -- 🚨 CORRECCIÓN: Usar @ID_Abonado
        `;
        const result = await executeQuery(query, { ID_Abonado: id }); // Parámetro como objeto
        return result[0];
    }
}

module.exports = AbonadoModel;