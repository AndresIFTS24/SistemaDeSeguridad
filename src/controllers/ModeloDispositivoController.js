// src/controllers/ModeloDispositivoController.js (COMPLETO Y CORREGIDO)

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
            
            // Si el servicio lanza 404, se captura en el catch. Si devuelve un objeto, es 200.
            res.status(200).json({
                message: '✅ Modelo encontrado exitosamente.',
                modelo: modelo
            });
        } catch (error) {
            const status = error.cause || 500;
            res.status(status).json({
                message: error.message, 
                error: error.message
            });
        }
    }

    /** PUT /api/modelos/:id */
    static async update(req, res) {
        try {
            const { id } = req.params;
            const updatedModelo = await ModeloDispositivoService.updateModelo(id, req.body);
            
            // Si el servicio lanza 404, se captura en el catch.
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
    // Usamos 'deactivateModelo' en el servicio para un borrado LÓGICO como sugiere el routes.js (softDelete)
    static async softDelete(req, res) { 
        try {
            const { id } = req.params;
            const deactivatedModelo = await ModeloDispositivoService.deactivateModelo(id); 
            
            // Si el servicio lanza 404, se captura en el catch.
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
}

module.exports = ModeloDispositivoController;