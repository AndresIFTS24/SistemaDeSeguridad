// src/services/EventoService.js (VERSIÓN COMPLETA Y FINAL)

const EventoModel = require('../models/EventoModel');

class EventoService {
    
    /** Registra un nuevo evento. */
    static async createEvento(data) {
        const { ID_Dispositivo, ID_CodigoEvento } = data;
        
        if (!ID_Dispositivo || !ID_CodigoEvento) {
            throw new Error('Faltan campos obligatorios: ID_Dispositivo e ID_CodigoEvento.', { cause: 400 });
        }
        
        try {
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

    /** Busca un evento por ID. */
    static async getEventoById(id) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de evento debe ser un número válido.', { cause: 400 });
        }
        
        const evento = await EventoModel.findById(id);

        if (!evento) {
            throw new Error(`Evento con ID ${id} no encontrado.`, { cause: 404 });
        }
        return evento;
    }
    
    /** Actualiza el estado de un evento. */
    static async updateEventoEstado(id, nuevoEstado) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de evento debe ser un número válido.', { cause: 400 });
        }
        
        const estadosValidos = ['Pendiente', 'En Progreso', 'Cerrado'];
        if (!estadosValidos.includes(nuevoEstado)) {
            throw new Error('Estado no válido. Use: Pendiente, En Progreso o Cerrado.', { cause: 400 });
        }

        const updatedEvento = await EventoModel.updateEstado(id, nuevoEstado);

        if (!updatedEvento) {
            throw new Error(`Evento con ID ${id} no encontrado para actualizar.`, { cause: 404 });
        }
        return updatedEvento;
    }


    /** Obtiene eventos filtrados por ID de Dispositivo. */
    static async getEventosByDispositivo(id) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de dispositivo debe ser un número válido.', { cause: 400 });
        }
        
        // 🚨 CORRECCIÓN: Llamamos a findByDispositivoId, que usa el ID del dispositivo
        const eventos = await EventoModel.findByDispositivoId(id);

        // Si devuelve un array vacío, lo retorna. No es un error 404.
        return eventos;
    }

    /** Elimina un evento. */
    static async deleteEvento(id) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de evento debe ser un número válido.', { cause: 400 });
        }
        
        const deletedEvento = await EventoModel.delete(id);
        
        if (!deletedEvento) {
            throw new Error(`Evento con ID ${id} no encontrado para eliminar.`, { cause: 404 });
        }
        
        return deletedEvento;
    }
}

module.exports = EventoService;