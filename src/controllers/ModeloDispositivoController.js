// src/controllers/ModeloDispositivoController.js (COMPLETO Y CORREGIDO)

const ModeloDispositivoService = require('../services/ModeloDispositivoService');
const handleError = require('../utils/errorHandler');

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
            handleError(res, error, 'Error al crear el modelo de dispositivo.');
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
            handleError(res, error, 'Error interno del servidor al obtener modelos.');
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
            handleError(res, error, 'Error al buscar el modelo de dispositivo.');
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
            handleError(res, error, 'Error al actualizar el modelo de dispositivo.');
        }
    }

    /** DELETE /api/modelos/:id (Borrado físico: la tabla no tiene columna Activo) */
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const deletedModelo = await ModeloDispositivoService.deleteModelo(id);

            res.status(200).json({
                message: `✅ Modelo (ID: ${id}) ha sido eliminado exitosamente.`,
                modelo: deletedModelo
            });
        } catch (error) {
            handleError(res, error, 'Error al eliminar el modelo de dispositivo.');
        }
    }
}

module.exports = ModeloDispositivoController;