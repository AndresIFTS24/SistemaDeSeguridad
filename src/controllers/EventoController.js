// src/controllers/EventoController.js

const EventoService = require('../services/EventoService');

class EventoController {
    
    /** POST /api/eventos (Creación de un nuevo evento) */
    static async create(req, res) {
        try {
            const newEvento = await EventoService.createEvento(req.body);
            res.status(201).json({
                message: '✅ Evento registrado exitosamente.',
                evento: newEvento
            });
        } catch (error) {
            const status = error.cause || 500;
            res.status(status).json({
                message: error.message,
                error: error.message
            });
        }
    }

    /** GET /api/eventos (Obtener todos los eventos) */
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

    /** GET /api/eventos/:id (Obtener un evento por ID) */
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

    /** GET /api/eventos/dispositivo/:id (Obtener eventos por Dispositivo) */
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
            res.status(status).json({
                message: error.message,
                error: error.message
            });
        }
    }

    static async updateEstado(req, res) {
        try {
            const { id } = req.params;
            const { Estado } = req.body;

            if (!Estado) {
                throw new Error('El campo Estado es obligatorio para la actualización.', { cause: 400 });
            }

            const updatedEvento = await EventoService.updateEventoEstado(id, Estado);
            
            res.status(200).json({
                message: `✅ Estado del Evento ID ${id} actualizado a '${Estado}'.`,
                evento: updatedEvento
            });
        } catch (error) {
            const status = error.cause || 500;
            res.status(status).json({
                message: error.message,
                error: error.message
            });
        }
    }
}

module.exports = EventoController;