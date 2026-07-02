// src/controllers/AbonadoController.js

const AbonadoService = require('../services/AbonadoService');
const handleError = require('../utils/errorHandler');

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
            handleError(res, error, 'Error interno del servidor al obtener la lista de abonados.');
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
            handleError(res, error, 'Error al buscar el abonado.');
        }
    }

    /** * POST /api/abonados
     * Crea un nuevo abonado
     */
    static async create(req, res) {
        try {
            const newAbonado = await AbonadoService.createAbonado(req.body);
            const avisoGeo = newAbonado.geocodificado
                ? ''
                : ' (No se pudo geocodificar la dirección automáticamente; se puede completar más tarde desde el mapa de cobertura.)';

            return res.status(201).json({
                message: `✅ Abonado creado exitosamente.${avisoGeo}`,
                abonado: newAbonado
            });
        } catch (error) {
            handleError(res, error, 'Error al crear el abonado.');
        }
    }

    /** * PUT /api/abonados/:id 
     * Actualiza datos de un abonado
     */
    static async update(req, res) {
        try {
            const { id } = req.params;
            const updatedAbonado = await AbonadoService.updateAbonado(id, req.body);
            const avisoGeo = updatedAbonado.geocodificado
                ? ''
                : ' (No se pudo geocodificar la dirección automáticamente; se puede completar más tarde desde el mapa de cobertura.)';

            return res.status(200).json({
                message: `✅ Abonado (ID: ${id}) ha sido actualizado exitosamente.${avisoGeo}`,
                abonado: updatedAbonado
            });
        } catch (error) {
            handleError(res, error, 'Error al actualizar.');
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
            handleError(res, error, 'Error al desactivar.');
        }
    }
}

module.exports = AbonadoController;