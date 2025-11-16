// src/controllers/AsignacionController.js

const AsignacionService = require('../services/AsignacionService');
const handleError = require('../utils/errorHandler'); 

class AsignacionController {

    static async create(req, res) {
        try {
            const newAsignacion = await AsignacionService.createAsignacion(req.body);
            res.status(201).json({
                message: 'Orden de Trabajo creada con éxito.',
                asignacion: newAsignacion
            });
        } catch (error) {
            handleError(res, error, 'Error al crear la Orden de Trabajo.');
        }
    }

    static async getAll(req, res) {
        try {
            const asignaciones = await AsignacionService.getAllAsignaciones();
            res.status(200).json(asignaciones);
        } catch (error) {
            handleError(res, error, 'Error al obtener asignaciones.');
        }
    }

    static async getById(req, res) {
        try {
            const asignacion = await AsignacionService.getAsignacionById(req.params.id);
            res.status(200).json(asignacion);
        } catch (error) {
            handleError(res, error, 'Error al obtener la Orden de Trabajo por ID.');
        }
    }

    static async update(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;
            
            const updatedAsignacion = await AsignacionService.updateAsignacion(id, data);
            
            res.status(200).json({
                message: 'Orden de Trabajo actualizada con éxito.',
                asignacion: updatedAsignacion
            });
        } catch (error) {
            handleError(res, error, 'Error al actualizar la Orden de Trabajo.');
        }
    }

    static async deactivate(req, res) {
        try {
            const deactivatedAsignacion = await AsignacionService.deactivateAsignacion(req.params.id);
            res.status(200).json({
                message: 'Orden de Trabajo finalizada con éxito.',
                asignacion: deactivatedAsignacion
            });
        } catch (error) {
            handleError(res, error, 'Error al finalizar la Orden de Trabajo.');
        }
    }
}

module.exports = AsignacionController;