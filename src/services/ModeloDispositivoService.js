// src/services/ModeloDispositivoService.js (COMPLETO Y CORREGIDO)

const ModeloDispositivoModel = require('../models/ModeloDispositivoModel');

class ModeloDispositivoService {
    
    /** Crea un nuevo modelo con validación. */
    static async createModelo(data) {
        const { nombreModelo, tipoDispositivo } = data;
        
        if (!nombreModelo || !tipoDispositivo) {
            throw new Error('Faltan campos obligatorios: NombreModelo y TipoDispositivo.', { cause: 400 });
        }
        
        try {
            const newModelo = await ModeloDispositivoModel.create(data);
            return newModelo;
        } catch (error) {
            if (error.message && error.message.includes('UNIQUE KEY constraint')) {
                throw new Error('El NombreModelo ya está registrado.', { cause: 409 });
            }
            throw error;
        }
    }

    /** Obtiene todos los modelos. */
    static async getAllModelos() {
        return ModeloDispositivoModel.findAll();
    }
    
    /** Busca un modelo por ID. */
    static async getModeloById(id) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de modelo debe ser un número válido.', { cause: 400 });
        }
        
        const modelo = await ModeloDispositivoModel.findById(id);

        if (!modelo) {
            throw new Error('Modelo de dispositivo no encontrado.', { cause: 404 });
        }
        return modelo; 
    }
    
    /** Actualiza los datos de un modelo. */
    static async updateModelo(id, data) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de modelo debe ser un número válido.', { cause: 400 });
        }
        
        const updates = [];
        const params = [];
        
        // La lista 'updates' usa '?' como placeholder, que será transformado
        // a '@p1', '@p2', etc. por el Modelo antes de llamar a executeQuery.
        if (data.nombreModelo) { updates.push('NombreModelo = ?'); params.push(data.nombreModelo); }
        if (data.fabricante) { updates.push('Fabricante = ?'); params.push(data.fabricante); }
        if (data.tipoDispositivo) { updates.push('TipoDispositivo = ?'); params.push(data.tipoDispositivo); }

        if (updates.length === 0) {
            throw new Error('Se requiere al menos un campo para actualizar.', { cause: 400 });
        }

        try {
            const updatedModelo = await ModeloDispositivoModel.update(id, updates, params);
            
            if (!updatedModelo) {
                // Si la actualización no afectó a ninguna fila, el modelo devuelve undefined
                throw new Error('Modelo no encontrado para actualizar.', { cause: 404 });
            }
            return updatedModelo;
        } catch (error) {
            if (error.message && error.message.includes('UNIQUE KEY constraint')) {
                throw new Error('El NombreModelo ya está siendo utilizado por otro dispositivo.', { cause: 409 });
            }
            throw error;
        }
    }

    /** Elimina físicamente un modelo. */
    static async deleteModelo(id) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de modelo debe ser un número válido.', { cause: 400 });
        }
        
        try {
            const deletedModelo = await ModeloDispositivoModel.delete(id);
        
            if (!deletedModelo) {
                throw new Error('Modelo no encontrado o no pudo ser eliminado.', { cause: 404 });
            }
            return deletedModelo;
        } catch (error) {
             // Manejo de error si hay dependencias (Foreign Key violation)
            if (error.message && error.message.includes('FOREIGN KEY constraint')) {
                throw new Error('No se puede eliminar el modelo porque está asociado a dispositivos existentes.', { cause: 409 });
            }
            throw error;
        }
    }
    
    /** Realiza un borrado lógico (desactivación). */
    static async deactivateModelo(id) {
        // En un borrado lógico, actualizas un campo 'Activo'.
        // Usamos '?' para que el Modelo pueda hacer la conversión a @p1.
        const updates = ['Activo = ?']; 
        const params = [false]; // Asume que 'false' es el valor para desactivar.
        
        const deactivatedModelo = await ModeloDispositivoModel.update(id, updates, params);

        if (!deactivatedModelo) {
            throw new Error('Modelo no encontrado o no se pudo desactivar.', { cause: 404 });
        }
        return deactivatedModelo;
    }
}

module.exports = ModeloDispositivoService;