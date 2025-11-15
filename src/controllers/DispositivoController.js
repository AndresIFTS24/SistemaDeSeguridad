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
            const status = error.cause || 500;
            let message = error.message;

            // Si el error viene del servicio (ej. ID inválido)
            if (status === 400) message = 'ID de dispositivo inválido.';
            
            res.status(status).json({
                message: message,
                error: error.message
            });
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
            const status = error.cause || 500;
            res.status(status).json({
                message: error.message,
                error: error.message
            });
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
            const status = error.cause || 500;
            let message = error.message;

            if (status === 404) message = 'Dispositivo no encontrado o ya estaba inactivo.';
            
            res.status(status).json({
                message: message,
                error: error.message
            });
        }
    }
    
    // Alias para softDelete, en caso de que las rutas usen 'softDelete'
    static softDelete = DispositivoController.deactivate; 
}

module.exports = DispositivoController;