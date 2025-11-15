// src/controllers/DispositivoController.js

const DispositivoService = require('../services/DispositivoService');

class DispositivoController {
    
    /** POST /api/dispositivos */
    static async create(req, res) {
        try {
            const newDispositivo = await DispositivoService.createDispositivo(req.body);
            res.status(201).json({
                message: '✅ Dispositivo creado exitosamente.',
                dispositivo: newDispositivo
            });
        } catch (error) {
            const status = error.cause || 500;
            res.status(status).json({
                message: error.message,
                error: error.message
            });
        }
    }

    /** GET /api/dispositivos */
    static async getAll(req, res) {
        try {
            const dispositivos = await DispositivoService.getAllDispositivos();
            res.status(200).json({
                message: `✅ Se encontraron ${dispositivos.length} dispositivos.`,
                total: dispositivos.length,
                dispositivos: dispositivos
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error interno del servidor al obtener dispositivos.',
                error: error.message
            });
        }
    }

    /** GET /api/dispositivos/:id */
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const dispositivo = await DispositivoService.getDispositivoById(id);
            res.status(200).json({
                message: '✅ Dispositivo encontrado exitosamente.',
                dispositivo: dispositivo
            });
        } catch (error) {
            const status = error.cause || 500;
            res.status(status).json({
                message: status === 404 ? 'Dispositivo no encontrado.' : error.message,
                error: error.message
            });
        }
    }

    /** PUT /api/dispositivos/:id */
    static async update(req, res) {
        try {
            const { id } = req.params;
            const updatedDispositivo = await DispositivoService.updateDispositivo(id, req.body);
            res.status(200).json({
                message: `✅ Dispositivo (ID: ${id}) ha sido actualizado exitosamente.`,
                dispositivo: updatedDispositivo
            });
        } catch (error) {
            const status = error.cause || 500;
            res.status(status).json({
                message: error.message,
                error: error.message
            });
        }
    }

    /** DELETE /api/dispositivos/:id (Soft Delete) */
    static async softDelete(req, res) {
        try {
            const { id } = req.params;
            const deactivatedDispositivo = await DispositivoService.deactivateDispositivo(id);
            res.status(200).json({
                message: `✅ Dispositivo (ID: ${id}) ha sido desactivado (borrado lógico) exitosamente.`,
                dispositivo: deactivatedDispositivo
            });
        } catch (error) {
            const status = error.cause || 500;
            let message = error.message;

            if (status === 404) message = 'Dispositivo no encontrado o ya estaba inactivo.';
            
            res.status(status).json({
                message: message,
                error: error.message
            });
        }
    }
}

module.exports = DispositivoController;