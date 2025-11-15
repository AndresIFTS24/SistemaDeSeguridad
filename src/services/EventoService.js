// src/services/EventoService.js

const EventoModel = require('../models/EventoModel');

class EventoService {
    
    /** Registra un nuevo evento. */
    static async createEvento(data) {
        const { ID_Dispositivo, TipoEvento, Descripcion, NivelCriticidad } = data;
        
        if (!ID_Dispositivo || !TipoEvento || !Descripcion) {
            throw new Error('Faltan campos obligatorios: ID_Dispositivo, TipoEvento y Descripcion.', { cause: 400 });
        }
        
        try {
            const newEvento = await EventoModel.create(data);
            return newEvento;
        } catch (error) {
            // Manejo de error de Foreign Key (si el ID_Dispositivo no existe)
            if (error.message && error.message.includes('FOREIGN KEY constraint')) {
                throw new Error('El ID de Dispositivo proporcionado no existe.', { cause: 400 });
            }
            throw error;
        }
    }

    /** Obtiene todos los eventos. */
    static async getAllEventos() {
        return EventoModel.findAll();
    }
    
    /** Obtiene eventos filtrados por ID de Dispositivo. */
    static async getEventosByDispositivo(id) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de dispositivo debe ser un número válido.', { cause: 400 });
        }
        
        const eventos = await EventoModel.findByDispositivoId(id);

        if (eventos.length === 0) {
            // No lanza 404 si el dispositivo existe pero no tiene eventos, sino si el ID es inválido.
            // Aquí asumiremos que, si no hay eventos, devolvemos una lista vacía con 200.
            return eventos; 
        }
        return eventos;
    }
}

module.exports = EventoService;