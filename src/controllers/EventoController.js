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
}

module.exports = EventoController;