// src/services/DispositivoService.js

const DispositivoModel = require('../models/DispositivoModel');

class DispositivoService {
    
    /** Crea un nuevo dispositivo. */
    static async createDispositivo(data) {
        const { ID_Modelo, Serie, NombreDispositivo } = data;
        
        if (!ID_Modelo || !Serie || !NombreDispositivo) {
            throw new Error('Faltan campos obligatorios: ID_Modelo, Serie y NombreDispositivo.', { cause: 400 });
        }
        
        // 🚨 INICIO DE CORRECCIÓN: Preprocesamiento de Fecha
        if (data.FechaInstalacion) {
            try {
                // Intenta crear un objeto Date a partir de la cadena ISO
                const date = new Date(data.FechaInstalacion); 
                
                if (isNaN(date)) {
                    throw new Error('Formato de fecha de instalación inválido.');
                }
                
                // Formatea la fecha a 'YYYY-MM-DD' para evitar problemas con msnodesql
                data.FechaInstalacion = date.toISOString().slice(0, 10); 

            } catch (e) {
                // Maneja errores si la cadena no se puede parsear
                throw new Error('El formato de FechaInstalacion no es válido.', { cause: 400 });
            }
        }
        // 🚨 FIN DE CORRECCIÓN
        
        try {
            // Se asume que el DispositivoModel.create() extrae solo los campos necesarios
            // y no incluye NombreModelo ni Fabricante.
            const newDispositivo = await DispositivoModel.create(data);
            return newDispositivo;
        } catch (error) {
            // Manejo de error de serie duplicada o FK no válida
            if (error.message && error.message.includes('UNIQUE KEY constraint')) {
                throw new Error('La Serie proporcionada ya está registrada.', { cause: 409 });
            }
            if (error.message && error.message.includes('FOREIGN KEY constraint')) {
                throw new Error('El ID de Modelo o la Dirección no existen.', { cause: 400 });
            }
            throw error;
        }
    }

    /** Obtiene todos los dispositivos. */
    static async getAllDispositivos() {
        return DispositivoModel.findAll();
    }
    
    /** Busca un dispositivo por ID. */
    static async getDispositivoById(id) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de dispositivo debe ser un número válido.', { cause: 400 });
        }
        
        const dispositivo = await DispositivoModel.findById(id);

        if (!dispositivo) {
            throw new Error('Dispositivo no encontrado.', { cause: 404 }); 
        }
        return dispositivo; 
    }
    
    /** Actualiza los datos de un dispositivo. */
    static async updateDispositivo(id, data) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de dispositivo debe ser un número válido.', { cause: 400 });
        }
        
        const updates = [];
        const params = [];
        
        // Preprocesar la fecha en caso de que se esté actualizando
        if (data.FechaInstalacion) {
            const date = new Date(data.FechaInstalacion);
            if (!isNaN(date)) {
                data.FechaInstalacion = date.toISOString().slice(0, 10);
            } else {
                throw new Error('El formato de FechaInstalacion no es válido para actualizar.', { cause: 400 });
            }
        }

        // 1. ID_Modelo
        if (data.ID_Modelo) { updates.push('ID_Modelo = ?'); params.push(data.ID_Modelo); }
        // 2. NumeroSerie (La entrada es 'Serie', la DB es 'NumeroSerie')
        if (data.Serie) { updates.push('NumeroSerie = ?'); params.push(data.Serie); } 
        // 3. NombreDispositivo
        if (data.NombreDispositivo) { updates.push('NombreDispositivo = ?'); params.push(data.NombreDispositivo); }
        // 4. Ubicacion (La entrada es 'Ubicacion', la DB es 'Zona_Ubicacion')
        if (data.Ubicacion) { updates.push('Zona_Ubicacion = ?'); params.push(data.Ubicacion); } 
        // 5. Estado
        if (data.Estado !== undefined && data.Estado !== null) { updates.push('Estado = ?'); params.push(data.Estado); }
        // 6. FechaInstalacion (Se agrega aquí después de ser preprocesada)
        if (data.FechaInstalacion) { updates.push('FechaInstalacion = ?'); params.push(data.FechaInstalacion); }


        if (updates.length === 0) {
            throw new Error('Se requiere al menos un campo para actualizar.', { cause: 400 });
        }

        try {
            const updatedDispositivo = await DispositivoModel.update(id, updates, params);
            
            if (!updatedDispositivo) {
                throw new Error('Dispositivo no encontrado para actualizar.', { cause: 404 });
            }
            return updatedDispositivo;
        } catch (error) {
            if (error.message && error.message.includes('UNIQUE KEY constraint')) {
                throw new Error('La Serie proporcionada ya está siendo utilizada por otro dispositivo.', { cause: 409 });
            }
            if (error.message && error.message.includes('FOREIGN KEY constraint')) {
                throw new Error('El ID de Modelo o la Dirección proporcionada no existen.', { cause: 400 });
            }
            throw error;
        }
    }

    /** Desactiva (soft delete) un dispositivo. */
    static async deactivateDispositivo(id) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de dispositivo debe ser un número válido.', { cause: 400 });
        }
        
        const deactivatedDispositivo = await DispositivoModel.softDelete(id);
        
        if (!deactivatedDispositivo) {
            throw new Error('Dispositivo no encontrado o ya estaba inactivo.', { cause: 404 });
        }

        return deactivatedDispositivo;
    }
}

module.exports = DispositivoService;