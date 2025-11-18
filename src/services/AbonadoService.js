// src/services/AbonadoService.js (COMPLETO Y CORREGIDO PARA MSSQL)

const AbonadoModel = require('../models/AbonadoModel');

class AbonadoService {
    
    /** Registra un nuevo abonado. */
    static async createAbonado(abonadoData) {
        // ... (Validaciones y manejo de errores)
        if (!abonadoData.nombreCompleto || !abonadoData.dni || !abonadoData.idZona) {
            throw new Error('Faltan campos obligatorios: Nombre, DNI y ID_Zona.', { cause: 400 });
        }
        
        // --- 2. Preparar datos y Crear abonado en la DB ---
        try {
            // 🚨 Mapeo de datos para el modelo, usando nombres de columna de DB
            const dataToCreate = {
                RazonSocial: abonadoData.nombreCompleto,
                RUT: abonadoData.dni,
                ContactoPrincipal: abonadoData.nombreCompleto, // Usamos nombreCompleto como ContactoPrincipal
                TelefonoContacto: abonadoData.telefono || null,
                EmailContacto: abonadoData.email || null,
                ID_Zona: abonadoData.idZona
            };
            
            const newAbonado = await AbonadoModel.create(dataToCreate); 
            return newAbonado;
        } catch (error) {
            // ... (Manejo de errores)
            if (error.message && error.message.includes('UNIQUE KEY constraint')) {
                 throw new Error('El DNI proporcionado ya está registrado para otro abonado.', { cause: 409 });
            }
            if (error.message && error.message.includes('FOREIGN KEY constraint')) {
                 throw new Error('Error de relación. El ID de Zona proporcionado no existe.', { cause: 400 });
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
        const params = {}; // 🚨 CAMBIO CLAVE: Objeto para mssql
        
        const fieldMapping = {
            // JSON key : DB Column Name
            razonSocial: 'RazonSocial',
            rut: 'RUT',
            contactoPrincipal: 'ContactoPrincipal',
            telefonoContacto: 'TelefonoContacto',
            emailContacto: 'EmailContacto',
            activo: 'Activo', 
            idZona: 'ID_Zona',
            // Nombres simplificados del JSON
            nombreCompleto: 'RazonSocial', 
            dni: 'RUT', 
            telefono: 'TelefonoContacto', 
            email: 'EmailContacto'
        };

        let hasUpdate = false;
        
        for (const [key, dbColumn] of Object.entries(fieldMapping)) {
            const value = data[key];
            
            if (key in data) { 
                // Usaremos el nombre de la columna DB como nombre del parámetro
                const paramName = dbColumn; 

                // Evitar duplicados (ej: si mandan 'dni' y 'rut')
                if (updates.some(u => u.startsWith(dbColumn))) {
                    continue; 
                }

                // Validación específica para 'Activo'
                if (dbColumn === 'Activo' && (value !== 0 && value !== 1)) {
                    throw new Error('El campo Activo debe ser 0 o 1.', { cause: 400 });
                }
                
                // 🚨 CORRECCIÓN: Generar "Columna = @NombreColumna"
                updates.push(`${dbColumn} = @${paramName}`); 
                
                // 🚨 CORRECCIÓN: Agregar al objeto de parámetros con el nombre correcto
                params[paramName] = value; 
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
            // ... (Manejo de errores)
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