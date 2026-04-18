// src/controllers/AbonadoController.js

const AbonadoService = require('../services/AbonadoService');

class AbonadoController {
    
    /** * GET /api/abonados
     * Trae la lista completa de abonados
     */
    static async getAll(req, res) {
        try {
            const abonados = await AbonadoService.getAllAbonados();
            
            // BLINDAJE: Si no hay abonados, enviamos 200 y array vacío.
            // Esto evita que Angular dispare el error 404.
            if (!abonados || abonados.length === 0) {
                return res.status(200).json({
                    message: 'Consulta exitosa: No hay abonados registrados.',
                    total: 0,
                    abonados: []
                });
            }
            
            return res.status(200).json({
                message: `✅ Se encontraron ${abonados.length} abonados.`,
                total: abonados.length,
                abonados: abonados
            });
        } catch (error) {
            console.error('ERROR en AbonadoController.getAll:', error.message);
            return res.status(500).json({
                message: 'Error interno del servidor al obtener la lista de abonados.',
                error: error.message
            });
        }
    }

    /** * GET /api/abonados/:id 
     * Busca un abonado específico
     */
    static async getById(req, res) {
        try {
            const { id } = req.params;
            
            // Validamos que el ID exista
            if (!id) {
                return res.status(400).json({ message: 'El ID del abonado es requerido.' });
            }

            const abonado = await AbonadoService.getAbonadoById(id);
            
            if (!abonado) {
                return res.status(404).json({
                    message: 'Abonado no encontrado.',
                    error: 'No existe un abonado con el ID proporcionado.'
                });
            }

            return res.status(200).json({
                message: '✅ Abonado encontrado exitosamente.',
                abonado: abonado
            });
        } catch (error) {
            const status = error.cause || 500;
            return res.status(status).json({
                message: 'Error al buscar el abonado.',
                error: error.message
            });
        }
    }

    /** * POST /api/abonados 
     * Crea un nuevo abonado
     */
    static async create(req, res) {
        try {
            const newAbonado = await AbonadoService.createAbonado(req.body);
            
            return res.status(201).json({
                message: '✅ Abonado creado exitosamente.',
                abonado: newAbonado
            });
        } catch (error) {
            const status = error.cause === 409 ? 409 : (error.cause === 400 ? 400 : 500);
            return res.status(status).json({
                message: error.message || 'Error al crear el abonado.',
                error: error.message
            });
        }
    }

    /** * PUT /api/abonados/:id 
     * Actualiza datos de un abonado
     */
    static async update(req, res) {
        try {
            const { id } = req.params;
            const updatedAbonado = await AbonadoService.updateAbonado(id, req.body);
            
            return res.status(200).json({
                message: `✅ Abonado (ID: ${id}) ha sido actualizado exitosamente.`,
                abonado: updatedAbonado
            });
        } catch (error) {
            const status = error.cause || 500;
            return res.status(status).json({
                message: status === 404 ? 'Abonado no encontrado para actualizar.' : 'Error al actualizar.',
                error: error.message
            });
        }
    }

    /** * DELETE /api/abonados/:id (Soft Delete) 
     * Desactiva un abonado sin borrarlo de la BD
     */
    static async softDelete(req, res) {
        try {
            const { id } = req.params;
            const deactivatedAbonado = await AbonadoService.deactivateAbonado(id);
            
            return res.status(200).json({
                message: `✅ Abonado (ID: ${id}) ha sido desactivado exitosamente.`,
                abonado: deactivatedAbonado
            });
        } catch (error) {
            const status = error.cause || 500;
            return res.status(status).json({
                message: status === 404 ? 'Abonado no encontrado o ya estaba inactivo.' : 'Error al desactivar.',
                error: error.message
            });
        }
    }
}

module.exports = AbonadoController;