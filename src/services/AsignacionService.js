// src/services/AsignacionService.js

const AsignacionModel = require('../models/AsignacionModel');
const AbonadoModel = require('../models/AbonadoModel'); // Para verificar existencia
const DispositivoModel = require('../models/DispositivoModel'); // Para verificar existencia

class AsignacionService {
    
    /** Crea una nueva asignación. */
    static async createAsignacion({ ID_Abonado, ID_Dispositivo }) {
        
        if (!ID_Abonado || !ID_Dispositivo) {
            throw new Error('Faltan campos obligatorios: ID_Abonado y ID_Dispositivo.', { cause: 400 });
        }
        
        // 1. Verificar si el dispositivo ya está asignado activamente
        const activeAssignment = await AsignacionModel.findActiveByDispositivoId(ID_Dispositivo);
        if (activeAssignment) {
            throw new Error(`El Dispositivo ID ${ID_Dispositivo} ya está asignado al Abonado ID ${activeAssignment.ID_Abonado} de forma activa. Desasigne primero.`, { cause: 409 });
        }

        try {
            // 2. Intentar crear la asignación
            const newAsignacion = await AsignacionModel.create({ ID_Abonado, ID_Dispositivo });
            return newAsignacion;
        } catch (error) {
            // Manejo de error de Foreign Key no válida
            if (error.message && error.message.includes('FOREIGN KEY constraint')) {
                // Podríamos ser más específicos verificando cada FK, pero esto captura el error de DB
                throw new Error('El ID de Abonado o el ID de Dispositivo no existen.', { cause: 400 });
            }
            throw error;
        }
    }

    /** Obtiene todas las asignaciones. */
    static async getAllAsignaciones() {
        return AsignacionModel.findAll();
    }
    
    /** Busca una asignación por ID. */
    static async getAsignacionById(id) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de asignación debe ser un número válido.', { cause: 400 });
        }
        
        const asignacion = await AsignacionModel.findById(id);

        if (!asignacion) {
            throw new Error('Asignación no encontrada.', { cause: 404 });
        }
        return asignacion; 
    }
    
    /** Desactiva (finaliza) una asignación. */
    static async deactivateAsignacion(id) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de asignación debe ser un número válido.', { cause: 400 });
        }
        
        const deactivatedAsignacion = await AsignacionModel.deactivate(id);
        
        if (!deactivatedAsignacion) {
            throw new Error('Asignación no encontrada o ya estaba inactiva.', { cause: 404 });
        }

        return deactivatedAsignacion;
    }
}

module.exports = AsignacionService;