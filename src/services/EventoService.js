// src/services/EventoService.js (VERSIÓN CORREGIDA Y FINAL)

const EventoModel = require('../models/EventoModel');

class EventoService {
    
    /** Registra un nuevo evento. */
    static async createEvento(data) {
        // 🚨 1. CORRECCIÓN: Destructuramos ID_Dispositivo e ID_CodigoEvento (ya no TipoEvento ni Descripcion).
        const { ID_Dispositivo, ID_CodigoEvento, Estado } = data;
        
        // 🚨 2. CORRECCIÓN: Validamos solo los campos necesarios.
        if (!ID_Dispositivo || !ID_CodigoEvento) {
            throw new Error('Faltan campos obligatorios: ID_Dispositivo e ID_CodigoEvento.', { cause: 400 });
        }
        
        try {
            // Pasamos el objeto 'data' completo al modelo (incluyendo el opcional Estado)
            const newEvento = await EventoModel.create(data);
            return newEvento;
        } catch (error) {
            // Manejo de error de Foreign Key (si ID_Dispositivo o ID_CodigoEvento no existe)
            if (error.message && error.message.includes('FOREIGN KEY constraint')) {
                throw new Error('El ID de Dispositivo o el ID de Código de Evento proporcionado no existe.', { cause: 400 });
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
            return eventos; 
        }
        return eventos;
    }
}

module.exports = EventoService;