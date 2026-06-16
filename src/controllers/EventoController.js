// src/controllers/EventoController.js

const EventoService = require('../services/EventoService');

class EventoController {

    /** POST /api/eventos */
    static async create(req, res) {
        try {
            const newEvento = await EventoService.createEvento(req.body);

            // Traemos el evento completo con todos los JOINs
            const eventoCompleto = await EventoService.getEventoById(newEvento.ID_Evento);

            // EMIT: notificamos a todos los clientes conectados
            const io = req.app.get('io');
            if (io) {
                io.emit('nuevo_evento', eventoCompleto);
                console.log(`📡 Socket emitido: nuevo_evento (ID: ${eventoCompleto.ID_Evento})`);
            }

            res.status(201).json({
                message: '✅ Evento registrado exitosamente.',
                evento: eventoCompleto
            });
        } catch (error) {
            const status = error.cause || 500;
            res.status(status).json({
                message: error.message,
                error: error.message
            });
        }
    }

    /** GET /api/eventos */
    static async getAll(req, res) {
        try {
            const eventos = await EventoService.getAllEventos();
            res.status(200).json({
                message: `✅ Se encontraron ${eventos.length} eventos.`,
                total: eventos.length,
                eventos: eventos
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error interno del servidor al obtener eventos.',
                error: error.message
            });
        }
    }

    /** GET /api/eventos/:id */
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const evento = await EventoService.getEventoById(id);
            res.status(200).json({
                message: `✅ Evento ID ${id} encontrado.`,
                evento: evento
            });
        } catch (error) {
            const status = error.cause || 500;
            res.status(status).json({
                message: error.message,
                error: error.message
            });
        }
    }

    /** GET /api/eventos/dispositivo/:id */
    static async getByDispositivo(req, res) {
        try {
            const { id } = req.params;
            const eventos = await EventoService.getEventosByDispositivo(id);
            res.status(200).json({
                message: `✅ Se encontraron ${eventos.length} eventos para el Dispositivo ID ${id}.`,
                total: eventos.length,
                eventos: eventos
            });
        } catch (error) {
            const status = error.cause || 500;
            res.status(status).json({ message: error.message, error: error.message });
        }
    }

    /** PUT /api/eventos/:id */
    static async updateEstado(req, res) {
        try {
            const { id } = req.params;
            const { Estado } = req.body;

            if (!Estado) {
                return res.status(400).json({
                    message: 'El campo Estado es obligatorio para la actualización.'
                });
            }

            const updatedEvento = await EventoService.updateEventoEstado(id, Estado);

            // EMIT: informamos el cambio de estado a todos los clientes
            const io = req.app.get('io');
            if (io) {
                io.emit('evento_actualizado', updatedEvento);
                console.log(`📡 Socket emitido: evento_actualizado (ID: ${id} → ${Estado})`);
            }

            res.status(200).json({
                message: `✅ Estado del Evento ID ${id} actualizado a '${Estado}'.`,
                evento: updatedEvento
            });
        } catch (error) {
            const status = error.cause || 500;
            res.status(status).json({ message: error.message, error: error.message });
        }
    }

    /** DELETE /api/eventos/:id */
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const deletedEvento = await EventoService.deleteEvento(id);

            if (!deletedEvento) {
                return res.status(404).json({
                    message: `Evento con ID ${id} no encontrado para eliminar.`
                });
            }

            res.status(200).json({
                message: `✅ Evento (ID: ${id}) eliminado exitosamente.`,
                evento: deletedEvento
            });
        } catch (error) {
            const status = error.cause || 500;
            res.status(status).json({ message: error.message, error: error.message });
        }
    }
}

module.exports = EventoController;