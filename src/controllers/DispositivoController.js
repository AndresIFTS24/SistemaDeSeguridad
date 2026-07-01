// src/controllers/DispositivoController.js

const DispositivoService = require('../services/DispositivoService');
const handleError = require('../utils/errorHandler');

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
            handleError(res, error, 'Error al crear el dispositivo.');
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
            handleError(res, error, 'Error interno del servidor al obtener dispositivos.');
        }
    }

    /** GET /api/dispositivos/:id */
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const dispositivo = await DispositivoService.getDispositivoById(id);
            
            // 🚨 CORRECCIÓN CLAVE: Devolver 404 si el servicio no encuentra el dispositivo.
            if (!dispositivo) {
                return res.status(404).json({
                    message: 'Dispositivo no encontrado.'
                });
            }

            res.status(200).json({
                message: '✅ Dispositivo encontrado exitosamente.',
                dispositivo: dispositivo
            });
        } catch (error) {
            handleError(res, error, 'Error al buscar el dispositivo.');
        }
    }

    /** PUT /api/dispositivos/:id */
    static async update(req, res) {
        try {
            const { id } = req.params;
            const updatedDispositivo = await DispositivoService.updateDispositivo(id, req.body);
            
            // 🚨 Añadir verificación 404 si el servicio devuelve null/undefined.
            if (!updatedDispositivo) {
                return res.status(404).json({ message: 'Dispositivo no encontrado para actualizar.' });
            }

            res.status(200).json({
                message: `✅ Dispositivo (ID: ${id}) ha sido actualizado exitosamente.`,
                dispositivo: updatedDispositivo
            });
        } catch (error) {
            handleError(res, error, 'Error al actualizar el dispositivo.');
        }
    }

    /** DELETE /api/dispositivos/:id (Soft Delete) */
    static async deactivate(req, res) { // 🔄 Renombrado a 'deactivate' para claridad
        try {
            const { id } = req.params;
            const deactivatedDispositivo = await DispositivoService.deactivateDispositivo(id);
            
            if (!deactivatedDispositivo) {
                 return res.status(404).json({ message: 'Dispositivo no encontrado o ya estaba inactivo.' });
            }

            res.status(200).json({
                message: `✅ Dispositivo (ID: ${id}) ha sido desactivado (borrado lógico) exitosamente.`,
                dispositivo: deactivatedDispositivo
            });
        } catch (error) {
            handleError(res, error, 'Error al desactivar el dispositivo.');
        }
    }

    // Alias para softDelete, en caso de que las rutas usen 'softDelete'
    static softDelete = DispositivoController.deactivate; 
}

module.exports = DispositivoController;