// src/controllers/ModeloDispositivoController.js

const ModeloDispositivoService = require('../services/ModeloDispositivoService');

class ModeloDispositivoController {
    
    /** POST /api/modelos */
    static async create(req, res) {
        try {
            const newModelo = await ModeloDispositivoService.createModelo(req.body);
            res.status(201).json({
                message: '✅ Modelo de dispositivo creado exitosamente.',
                modelo: newModelo
            });
        } catch (error) {
            const status = error.cause || 500;
            res.status(status).json({
                message: error.message,
                error: error.message
            });
        }
    }

    /** GET /api/modelos */
    static async getAll(req, res) {
        try {
            const modelos = await ModeloDispositivoService.getAllModelos();
            res.status(200).json({
                message: `✅ Se encontraron ${modelos.length} modelos.`,
                total: modelos.length,
                modelos: modelos
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error interno del servidor al obtener modelos.',
                error: error.message
            });
        }
    }

    /** GET /api/modelos/:id */
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const modelo = await ModeloDispositivoService.getModeloById(id);
            
            // 🚨 CORRECCIÓN 1: Manejar 404 cuando el servicio devuelve null/undefined
            if (!modelo) {
                 return res.status(404).json({ message: 'Modelo de Dispositivo no encontrado.' });
            }

            res.status(200).json({
                message: '✅ Modelo encontrado exitosamente.',
                modelo: modelo
            });
        } catch (error) {
            const status = error.cause || 500;
            res.status(status).json({
                // Mejorar mensaje de error para 404
                message: status === 404 ? 'Modelo no encontrado.' : error.message, 
                error: error.message
            });
        }
    }

    /** PUT /api/modelos/:id */
    static async update(req, res) {
        try {
            const { id } = req.params;
            const updatedModelo = await ModeloDispositivoService.updateModelo(id, req.body);
            
            // 🚨 CORRECCIÓN 2: Manejar 404 si la actualización no afectó ninguna fila
            if (!updatedModelo) {
                 return res.status(404).json({ message: 'Modelo no encontrado para actualizar.' });
            }

            res.status(200).json({
                message: `✅ Modelo (ID: ${id}) ha sido actualizado exitosamente.`,
                modelo: updatedModelo
            });
        } catch (error) {
            const status = error.cause || 500;
            res.status(status).json({
                message: error.message,
                error: error.message
            });
        }
    }

    /** DELETE /api/modelos/:id (Borrado Lógico) */
    // 🚨 CORRECCIÓN 3: Renombrado a softDelete para coincidir con el routes.js
    static async softDelete(req, res) { 
        try {
            const { id } = req.params;
            // Asumiendo que el servicio tiene un método llamado 'deactivateModelo'
            const deactivatedModelo = await ModeloDispositivoService.deactivateModelo(id); 
            
            // 🚨 CORRECCIÓN 4: Manejar 404 si el borrado no afectó ninguna fila
            if (!deactivatedModelo) {
                 return res.status(404).json({ message: 'Modelo no encontrado o ya estaba inactivo.' });
            }

            res.status(200).json({
                message: `✅ Modelo (ID: ${id}) ha sido desactivado (borrado lógico) exitosamente.`,
                modelo: deactivatedModelo
            });
        } catch (error) {
            const status = error.cause || 500;
            res.status(status).json({
                message: error.message,
                error: error.message
            });
        }
    }
    
    // Alias para el método 'delete' original en caso de que aún lo uses en alguna ruta antigua
    static delete = ModeloDispositivoController.softDelete; 
}

module.exports = ModeloDispositivoController;