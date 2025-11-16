// src/services/AsignacionService.js

const AsignacionModel = require('../models/AsignacionModel');

class AsignacionService {
    
    /** Crea una nueva Orden de Trabajo (OT). */
    static async createAsignacion(data) {
        const { ID_Direccion, ID_Tecnico, TipoOT, FechaProgramada } = data;
        
        if (!ID_Direccion || !ID_Tecnico || !TipoOT || !FechaProgramada) {
            throw new Error('Faltan campos obligatorios: ID_Direccion, ID_Tecnico, TipoOT y FechaProgramada.', { cause: 400 });
        }
        
        try {
            return await AsignacionModel.create(data);
        } catch (error) {
            if (error.message && error.message.includes('FOREIGN KEY constraint')) {
                throw new Error('El ID de Dirección o el ID de Técnico no existen.', { cause: 400 });
            }
            throw error;
        }
    }

    /** Obtiene todas las asignaciones/OTs. */
    static async getAllAsignaciones() {
        return AsignacionModel.findAll();
    }
    
    /** Busca una asignación/OT por ID. */
    static async getAsignacionById(id) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de asignación debe ser un número válido.', { cause: 400 });
        }
        
        const asignacion = await AsignacionModel.findById(id);

        if (!asignacion) {
            throw new Error('Asignación/Orden de Trabajo no encontrada.', { cause: 404 });
        }
        return asignacion; 
    }

    /** Actualiza campos de la OT. */
    static async updateAsignacion(id, data) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de asignación debe ser un número válido.', { cause: 400 });
        }
        
        const updates = [];
        const params = [];
        
        // Construcción dinámica de la consulta
        if (data.ID_Direccion) { updates.push('ID_Direccion = ?'); params.push(data.ID_Direccion); }
        if (data.ID_Tecnico) { updates.push('ID_Tecnico = ?'); params.push(data.ID_Tecnico); }
        if (data.TipoOT) { updates.push('TipoOT = ?'); params.push(data.TipoOT); }
        if (data.Descripcion) { updates.push('Descripcion = ?'); params.push(data.Descripcion); }
        if (data.FechaProgramada) { updates.push('FechaProgramada = ?'); params.push(data.FechaProgramada); }
        if (data.Estado) { updates.push('Estado = ?'); params.push(data.Estado); }
        
        if (updates.length === 0) {
            throw new Error('Se requiere al menos un campo para actualizar.', { cause: 400 });
        }

        try {
            const updatedAsignacion = await AsignacionModel.update(id, updates, params);
            
            if (!updatedAsignacion) {
                throw new Error('Orden de Trabajo no encontrada para actualizar.', { cause: 404 });
            }
            return updatedAsignacion;
        } catch (error) {
            if (error.message && error.message.includes('FOREIGN KEY constraint')) {
                throw new Error('El ID de Dirección o el ID de Técnico no existen.', { cause: 400 });
            }
            throw error;
        }
    }
    
    /** Finaliza una Orden de Trabajo. */
    static async deactivateAsignacion(id) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de asignación debe ser un número válido.', { cause: 400 });
        }
        
        const deactivatedAsignacion = await AsignacionModel.deactivate(id);
        
        if (!deactivatedAsignacion) {
            throw new Error('Orden de Trabajo no encontrada o ya estaba finalizada.', { cause: 404 });
        }

        return deactivatedAsignacion;
    }
}

module.exports = AsignacionService;