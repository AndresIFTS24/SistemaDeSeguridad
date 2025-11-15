// src/services/AbonadoService.js

const AbonadoModel = require('../models/AbonadoModel');

class AbonadoService {
    
    /** Registra un nuevo abonado. */
    static async createAbonado(abonadoData) {
        // --- 1. Validaciones básicas ---
        // Se mantiene la validación con los nombres de campos del JSON que se acordaron usar para la creación
        if (!abonadoData.nombreCompleto || !abonadoData.dni || !abonadoData.idZona) {
            throw new Error('Faltan campos obligatorios: Nombre, DNI y ID_Zona.', { cause: 400 });
        }
        
        // --- 2. Crear abonado en la DB ---
        try {
            // El modelo se encarga de mapear nombreCompleto -> RazonSocial y dni -> RUT
            const newAbonado = await AbonadoModel.create(abonadoData); 
            return newAbonado;
        } catch (error) {
            // Manejo de error de clave única para DNI/RUT
            if (error.message && error.message.includes('UNIQUE KEY constraint')) {
                 throw new Error('El DNI proporcionado ya está registrado para otro abonado.', { cause: 409 });
            }
            // Manejo de error de clave foránea
            if (error.message && error.message.includes('FOREIGN KEY constraint')) {
                 // Nota: Esto puede ser una FK a ZONAS o VENDEDORES que no se incluyó en tu modelo, pero lo dejamos por si acaso.
                 throw new Error('Error de relación. El ID de Zona o Vendedor proporcionado no existe.', { cause: 400 });
            }
            throw error;
        }
    }
    
    /** Obtiene todos los abonados. */
    static async getAllAbonados() {
        return await AbonadoModel.findAll();
    }


    /** Busca un abonado por ID, si no existe lanza error 404. */
    static async getAbonadoById(id) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de abonado debe ser un número válido.', { cause: 400 });
        }
        
        const abonado = await AbonadoModel.findById(id);

        if (!abonado) {
            throw new Error('Abonado no encontrado.', { cause: 404 });
        }
        
        return abonado; 
    }
    
    /** 🔄 Actualiza los datos de un abonado. (CORREGIDO Y AMPLIADO) */
    static async updateAbonado(id, data) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de abonado debe ser un número válido.', { cause: 400 });
        }
        
        const updates = [];
        const params = [];
        
        // 1. Construir dinámicamente la consulta de actualización
        
        // ACEPTAR NOMBRES DE COLUMNAS DE LA DB (si los envía el cliente)
        if (data.razonSocial) { updates.push('RazonSocial = ?'); params.push(data.razonSocial); }
        if (data.rut) { updates.push('RUT = ?'); params.push(data.rut); }
        if (data.contactoPrincipal) { updates.push('ContactoPrincipal = ?'); params.push(data.contactoPrincipal); }
        if (data.telefonoContacto) { updates.push('TelefonoContacto = ?'); params.push(data.telefonoContacto); }
        if (data.emailContacto) { updates.push('EmailContacto = ?'); params.push(data.emailContacto); }
        
        // ACEPTAR NOMBRES SIMPLIFICADOS DEL JSON (si los envía el cliente)
        if (data.nombreCompleto) { updates.push('RazonSocial = ?'); params.push(data.nombreCompleto); }
        if (data.dni) { updates.push('RUT = ?'); params.push(data.dni); }
        if (data.telefono) { updates.push('TelefonoContacto = ?'); params.push(data.telefono); }
        if (data.email) { updates.push('EmailContacto = ?'); params.push(data.email); }

        // Campo Activo
        if (data.activo !== undefined && data.activo !== null) { updates.push('Activo = ?'); params.push(data.activo); }

        if (updates.length === 0) {
            throw new Error('Se requiere al menos un campo para actualizar.', { cause: 400 });
        }

        try {
            const updatedAbonado = await AbonadoModel.update(id, updates, params);
            
            if (!updatedAbonado) {
                throw new Error('Abonado no encontrado para actualizar.', { cause: 404 });
            }
            
            return updatedAbonado;
        } catch (error) {
            if (error.message && error.message.includes('UNIQUE KEY constraint')) {
                 throw new Error('El RUT proporcionado ya está siendo utilizado por otro abonado.', { cause: 409 });
            }
            throw error;
        }
    }

    /** Desactiva (soft delete) un abonado. */
    static async deactivateAbonado(id) {
        if (isNaN(parseInt(id))) {
            throw new Error('El ID de abonado debe ser un número válido.', { cause: 400 });
        }
        
        const deactivatedAbonado = await AbonadoModel.softDelete(id);
        
        if (!deactivatedAbonado) {
            throw new Error('Abonado no encontrado o ya estaba inactivo.', { cause: 404 });
        }

        return deactivatedAbonado;
    }
}

module.exports = AbonadoService;