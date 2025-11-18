// src/services/DispositivoService.js (COMPLETO Y FINAL CORREGIDO PARA MSSQL)

const DispositivoModel = require('../models/DispositivoModel');

class DispositivoService {
    
    /** Crea un nuevo dispositivo. */
    static async createDispositivo(data) {
        const { ID_Modelo, Serie, NombreDispositivo } = data;
        
        if (!ID_Modelo || !Serie || !NombreDispositivo) {
            throw new Error('Faltan campos obligatorios: ID_Modelo, Serie y NombreDispositivo.', { cause: 400 });
        }
        
        // Preprocesamiento de Fecha
        if (data.FechaInstalacion) {
            try {
                const date = new Date(data.FechaInstalacion); 
                if (isNaN(date)) {
                    throw new Error('Formato de fecha de instalación inválido.');
                }
                // Formatea la fecha a 'YYYY-MM-DD'
                data.FechaInstalacion = date.toISOString().slice(0, 10); 
            } catch (e) {
                throw new Error('El formato de FechaInstalacion no es válido.', { cause: 400 });
            }
        }
        
        try {
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
        const params = {}; // 🚨 CAMBIO CLAVE: Objeto de parámetros para mssql
        let dataToProcess = { ...data };

        // 1. Mapeo de campos de entrada a nombres de columna de la DB (JSON_KEY: DB_COLUMN)
        const fieldMapping = {
            ID_Direccion: 'ID_Direccion', 
            ID_Modelo: 'ID_Modelo',
            NombreDispositivo: 'NombreDispositivo', // Agregado: permite actualizar el nombre
            Serie: 'NumeroSerie', 
            Ubicacion: 'Zona_Ubicacion', 
            FechaInstalacion: 'FechaInstalacion',
            Estado: 'Estado'
        };
        
        // 2. Preprocesar la FechaInstalacion (si se proporciona)
        if (dataToProcess.FechaInstalacion) {
            try {
                const date = new Date(dataToProcess.FechaInstalacion);
                if (isNaN(date)) {
                    throw new Error('El formato de FechaInstalacion no es válido para actualizar.', { cause: 400 });
                }
                dataToProcess.FechaInstalacion = date.toISOString().slice(0, 10);
            } catch (e) {
                throw new Error('El formato de FechaInstalacion no es válido para actualizar.', { cause: 400 });
            }
        }
        
        // 3. Construcción dinámica de la consulta
        let hasUpdate = false;
        
        for (const [key, dbColumn] of Object.entries(fieldMapping)) {
            if (key in dataToProcess) { 
                const value = dataToProcess[key];
                
                // Validación para IDs (FKs)
                if (['ID_Modelo', 'ID_Direccion'].includes(dbColumn)) {
                    if (value !== null && value !== undefined && isNaN(parseInt(value))) {
                        throw new Error(`${dbColumn} debe ser un número válido.`, { cause: 400 });
                    }
                }
                
                // 🚨 CORRECCIÓN: Generar "Columna = @NombreColumna"
                updates.push(`${dbColumn} = @${dbColumn}`);
                params[dbColumn] = value; // 🚨 CORRECCIÓN: Agregar al objeto de parámetros
                hasUpdate = true;
            }
        }


        if (!hasUpdate) {
            throw new Error('Se requiere al menos un campo válido para actualizar (ej. Serie, ID_Modelo, ID_Direccion).', { cause: 400 });
        }

        try {
            // El modelo ahora espera el array de strings con @Nombre y el objeto de parámetros
            const updatedDispositivo = await DispositivoModel.update(id, updates, params);
            
            if (!updatedDispositivo) {
                throw new Error('Dispositivo no encontrado para actualizar.', { cause: 404 });
            }
            return updatedDispositivo;
        } catch (error) {
            if (error.message && error.message.includes('UNIQUE KEY constraint') && error.message.includes('NumeroSerie')) {
                throw new Error('La Serie proporcionada ya está siendo utilizada por otro dispositivo.', { cause: 409 });
            }
            if (error.message && error.message.includes('FOREIGN KEY constraint')) {
                throw new Error('Error de relación. El ID de Modelo o Dirección proporcionada no existe.', { cause: 400 });
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