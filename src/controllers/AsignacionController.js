// src/controllers/AsignacionController.js

const AsignacionService = require('../services/AsignacionService');

class AsignacionController {
    
    /** POST /api/asignaciones */
    static async create(req, res) {
        try {
            const newAsignacion = await AsignacionService.createAsignacion(req.body);
            res.status(201).json({
                message: '✅ Dispositivo asignado exitosamente.',
                asignacion: newAsignacion
            });
        } catch (error) {
            const status = error.cause || 500;
            res.status(status).json({
                message: error.message,
                error: error.message
            });
        }
    }

    /** GET /api/asignaciones */
    static async getAll(req, res) {
        try {
            const asignaciones = await AsignacionService.getAllAsignaciones();
            res.status(200).json({
                message: `✅ Se encontraron ${asignaciones.length} asignaciones.`,
                total: asignaciones.length,
                asignaciones: asignaciones
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error interno del servidor al obtener asignaciones.',
                error: error.message
            });
        }
    }

    /** GET /api/asignaciones/:id */
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const asignacion = await AsignacionService.getAsignacionById(id);
            res.status(200).json({
                message: '✅ Asignación encontrada exitosamente.',
                asignacion: asignacion
            });
        } catch (error) {
            const status = error.cause || 500;
            res.status(status).json({
                message: status === 404 ? 'Asignación no encontrada.' : error.message,
                error: error.message
            });
        }
    }

    /** PUT/DELETE /api/asignaciones/:id/deactivate (Desasignar/Finalizar) */
    static async deactivate(req, res) {
        try {
            const { id } = req.params;
            const deactivatedAsignacion = await AsignacionService.deactivateAsignacion(id);
            res.status(200).json({
                message: `✅ Asignación (ID: ${id}) ha sido desactivada/finalizada exitosamente.`,
                asignacion: deactivatedAsignacion
            });
        } catch (error) {
            const status = error.cause || 500;
            let message = error.message;

            if (status === 404) message = 'Asignación no encontrada o ya estaba inactiva.';
            
            res.status(status).json({
                message: message,
                error: error.message
            });
        }
    }
}

module.exports = AsignacionController;