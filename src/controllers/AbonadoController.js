// src/controllers/AbonadoController.js

const AbonadoService = require('../services/AbonadoService');

class AbonadoController {
    
    /** POST /api/abonados */
    static async create(req, res) {
        try {
            const newAbonado = await AbonadoService.createAbonado(req.body); // Llama a createAbonado
            
            res.status(201).json({
                message: '✅ Abonado creado exitosamente.',
                abonado: newAbonado
            });
        } catch (error) {
            // Manejo de errores 409 (Duplicado) y 400 (Bad Request)
            const status = error.cause === 409 ? 409 : (error.cause === 400 ? 400 : 500);
            res.status(status).json({
                message: error.message,
                error: error.message
            });
        }
    }

    /** GET /api/abonados */
    static async getAll(req, res) {
        try {
            const abonados = await AbonadoService.getAllAbonados(); // Llama a getAllAbonados
            
            res.status(200).json({
                message: `✅ Se encontraron ${abonados.length} abonados.`,
                total: abonados.length,
                abonados: abonados
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error interno del servidor al obtener abonados.',
                error: error.message
            });
        }
    }

    /** GET /api/abonados/:id */
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const abonado = await AbonadoService.getAbonadoById(id);
            
            res.status(200).json({
                message: '✅ Abonado encontrado exitosamente.',
                abonado: abonado
            });
        } catch (error) {
            const status = error.cause || 500;
            res.status(status).json({
                message: status === 404 ? 'Abonado no encontrado.' : error.message,
                error: error.message
            });
        }
    }

    /** PUT /api/abonados/:id */
    static async update(req, res) {
        try {
            const { id } = req.params;
            const updatedAbonado = await AbonadoService.updateAbonado(id, req.body);
            
            res.status(200).json({
                message: `✅ Abonado (ID: ${id}) ha sido actualizado exitosamente.`,
                abonado: updatedAbonado
            });
        } catch (error) {
            const status = error.cause || 500;
            let message = error.message;

            if (status === 404) message = 'Abonado no encontrado para actualizar.';
            
            res.status(status).json({
                message: message,
                error: error.message
            });
        }
    }

    /** DELETE /api/abonados/:id (Soft Delete) */
    static async softDelete(req, res) {
        try {
            const { id } = req.params;
            const deactivatedAbonado = await AbonadoService.deactivateAbonado(id);
            
            res.status(200).json({
                message: `✅ Abonado (ID: ${id}) ha sido desactivado (borrado lógico) exitosamente.`,
                abonado: deactivatedAbonado
            });
        } catch (error) {
            const status = error.cause || 500;
            let message = error.message;

            if (status === 404) message = 'Abonado no encontrado o ya estaba inactivo.';
            
            res.status(status).json({
                message: message,
                error: error.message
            });
        }
    }
}

module.exports = AbonadoController;