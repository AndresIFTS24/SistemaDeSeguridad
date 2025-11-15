// src/services/AbonadoService.js (Actualización Completa)

const AbonadoModel = require('../models/AbonadoModel');

class AbonadoService {
    
    // ... (Métodos createAbonado y getAllAbonados existentes) ...

    /** Busca un abonado por ID, si no existe lanza error 404. (NUEVO) */
    static async getAbonadoById(id) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de abonado debe ser un número válido.', { cause: 400 });
        }
        
        const abonado = await AbonadoModel.findById(id);

        if (!abonado) {
            throw new Error('Abonado no encontrado.', { cause: 404 });
        }
        
        // Mapeo/limpieza de datos antes de devolver
        return abonado; 
    }
    
    /** Actualiza los datos de un abonado. (NUEVO) */
    static async updateAbonado(id, data) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de abonado debe ser un número válido.', { cause: 400 });
        }
        
        const updates = [];
        const params = [];
        
        // 1. Construir dinámicamente la consulta de actualización
        if (data.razonSocial) { updates.push('RazonSocial = ?'); params.push(data.razonSocial); }
        if (data.rut) { updates.push('RUT = ?'); params.push(data.rut); }
        if (data.contactoPrincipal) { updates.push('ContactoPrincipal = ?'); params.push(data.contactoPrincipal); }
        if (data.telefonoContacto) { updates.push('TelefonoContacto = ?'); params.push(data.telefonoContacto); }
        if (data.emailContacto) { updates.push('EmailContacto = ?'); params.push(data.emailContacto); }
        if (data.activo !== undefined && data.activo !== null) { updates.push('Activo = ?'); params.push(data.activo); }

        if (updates.length === 0) {
            throw new Error('Se requiere al menos un campo para actualizar.', { cause: 400 });
        }

        try {
            const updatedAbonado = await AbonadoModel.update(id, updates, params);
            
            if (!updatedAbonado) {
                // Si el ID no existe o no se hizo nada (aunque esto debería ser atrapado por findById primero)
                throw new Error('Abonado no encontrado para actualizar.', { cause: 404 });
            }
            
            return updatedAbonado;
        } catch (error) {
            if (error.message && error.message.includes('UNIQUE KEY constraint')) {
                throw new Error('El RUT proporcionado ya está siendo utilizado por otro abonado.', { cause: 409 });
            }
            throw error;
        }
    }

    /** Desactiva (soft delete) un abonado. (NUEVO) */
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