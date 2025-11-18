// src/services/AbonadoService.js

const AbonadoModel = require('../models/AbonadoModel');

class AbonadoService {
    
    /** Registra un nuevo abonado. */
    static async createAbonado(abonadoData) {
        // --- 1. Validaciones básicas ---
        // Se mantiene la validación con los nombres de campos del JSON que se acordaron usar para la creación
        if (!abonadoData.nombreCompleto || !abonadoData.dni || !abonadoData.idZona) {
            throw new Error('Faltan campos obligatorios: Nombre, DNI y ID_Zona.', { cause: 400 });
        }
        
        // --- 2. Crear abonado en la DB ---
        try {
            // El modelo se encarga de mapear nombreCompleto -> RazonSocial y dni -> RUT
            const newAbonado = await AbonadoModel.create(abonadoData); 
            return newAbonado;
        } catch (error) {
            // Manejo de error de clave única para DNI/RUT
            if (error.message && error.message.includes('UNIQUE KEY constraint')) {
                 throw new Error('El DNI proporcionado ya está registrado para otro abonado.', { cause: 409 });
            }
            // Manejo de error de clave foránea
            if (error.message && error.message.includes('FOREIGN KEY constraint')) {
                 // Nota: Esto puede ser una FK a ZONAS o VENDEDORES que no se incluyó en tu modelo, pero lo dejamos por si acaso.
                 throw new Error('Error de relación. El ID de Zona o Vendedor proporcionado no existe.', { cause: 400 });
            }
            throw error;
        }
    }
    
    /** Obtiene todos los abonados. */
    static async getAllAbonados() {
        return await AbonadoModel.findAll();
    }


    /** Busca un abonado por ID, si no existe lanza error 404. */
    static async getAbonadoById(id) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de abonado debe ser un número válido.', { cause: 400 });
        }
        
        const abonado = await AbonadoModel.findById(id);

        if (!abonado) {
            throw new Error('Abonado no encontrado.', { cause: 404 });
        }
        
        return abonado; 
    }
    
    /** 🔄 Actualiza los datos de un abonado. (CORREGIDO Y AMPLIADO) */
    static async updateAbonado(id, data) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de abonado debe ser un número válido.', { cause: 400 });
        }
        
        const updates = [];
        const params = [];
        
        // Mapeo de campos del JSON de entrada a los nombres de columna de la DB (DB: Columna)
        const fieldMapping = {
            // Nombres de columna de la DB (preferidos)
            razonSocial: 'RazonSocial',
            rut: 'RUT',
            contactoPrincipal: 'ContactoPrincipal',
            telefonoContacto: 'TelefonoContacto',
            emailContacto: 'EmailContacto',
            activo: 'Activo', // Activo debe ser 0 o 1
            idZona: 'ID_Zona', // Agregado por si existe la FK en la tabla
            
            // Nombres simplificados del JSON para comodidad del cliente
            nombreCompleto: 'RazonSocial', 
            dni: 'RUT', 
            telefono: 'TelefonoContacto', 
            email: 'EmailContacto'
        };

        let hasUpdate = false;
        
        for (const [key, dbColumn] of Object.entries(fieldMapping)) {
            const value = data[key];
            
            // Usamos 'in data' para permitir valores falsy (0, '', null) si son intencionales
            if (key in data) { 
                // Evitamos duplicados si el cliente manda 'dni' y 'rut' a la vez
                if (updates.some(u => u.startsWith(dbColumn))) {
                    continue; 
                }

                // 🚨 Validación específica para 'Activo' (asumiendo que es BIT o TINYINT)
                if (dbColumn === 'Activo' && (value !== 0 && value !== 1)) {
                    throw new Error('El campo Activo debe ser 0 o 1.', { cause: 400 });
                }
                
                updates.push(`${dbColumn} = ?`);
                params.push(value);
                hasUpdate = true;
            }
        }

        if (!hasUpdate) {
            throw new Error('Se requiere al menos un campo válido para actualizar.', { cause: 400 });
        }

        try {
            const updatedAbonado = await AbonadoModel.update(id, updates, params);
            
            if (!updatedAbonado) {
                throw new Error('Abonado no encontrado para actualizar.', { cause: 404 });
            }
            
            return updatedAbonado;
        } catch (error) {
            if (error.message && error.message.includes('UNIQUE KEY constraint') && error.message.includes('RUT')) {
                throw new Error('El DNI/RUT proporcionado ya está siendo utilizado por otro abonado.', { cause: 409 });
            }
            if (error.message && error.message.includes('FOREIGN KEY constraint')) {
                 throw new Error('Error de relación. El ID de Zona o Vendedor proporcionado no existe.', { cause: 400 });
            }
            throw error;
        }
    }

    /** Desactiva (soft delete) un abonado. */
    static async deactivateAbonado(id) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de abonado debe ser un número válido.', { cause: 400 });
        }
        
        const deactivatedAbonado = await AbonadoModel.softDelete(id);
        
        if (!deactivatedAbonado) {
            throw new Error('Abonado no encontrado o ya estaba inactivo.', { cause: 404 });
        }

        return deactivatedAbonado;
    }
}

module.exports = AbonadoService;