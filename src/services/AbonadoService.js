// src/services/AbonadoService.js
const { pool } = require('../config/db.config');

class AbonadoService {

    /**
     * Crear un nuevo abonado
     */
    static async createAbonado(data) {
        const { RazonSocial, RUT, ContactoPrincipal, TelefonoContacto, EmailContacto } = data;

        // 1. Validar si el RUT ya existe (si se proporciona)
        if (RUT) {
            const [existing] = await pool.execute(
                'SELECT ID_Abonado FROM ABONADOS WHERE RUT = ?',
                [RUT]
            );
            if (existing.length > 0) {
                const error = new Error('El RUT ya se encuentra registrado.');
                error.cause = 409;
                throw error;
            }
        }

        // 2. Insertar en la base de datos
        const sql = `
            INSERT INTO ABONADOS (RazonSocial, RUT, ContactoPrincipal, TelefonoContacto, EmailContacto, Activo) 
            VALUES (?, ?, ?, ?, ?, 1)
        `;
        
        const [result] = await pool.execute(sql, [
            RazonSocial, 
            RUT || null, 
            ContactoPrincipal || null, 
            TelefonoContacto || null, 
            EmailContacto || null
        ]);

        return {
            ID_Abonado: result.insertId,
            ...data
        };
    }

    /**
     * Obtener todos los abonados
     */
    static async getAllAbonados() {
        const [rows] = await pool.execute('SELECT * FROM ABONADOS');
        return rows;
    }

    /**
     * Obtener un abonado por ID
     */
    static async getAbonadoById(id) {
        const [rows] = await pool.execute('SELECT * FROM ABONADOS WHERE ID_Abonado = ?', [id]);
        
        if (rows.length === 0) {
            const error = new Error('Abonado no encontrado.');
            error.cause = 404;
            throw error;
        }
        return rows[0];
    }

    /**
     * Actualizar datos del abonado
     */
    static async updateAbonado(id, data) {
        const { RazonSocial, RUT, ContactoPrincipal, TelefonoContacto, EmailContacto } = data;

        // Verificar existencia
        await this.getAbonadoById(id);

        const sql = `
            UPDATE ABONADOS 
            SET RazonSocial = ?, RUT = ?, ContactoPrincipal = ?, TelefonoContacto = ?, EmailContacto = ?
            WHERE ID_Abonado = ?
        `;

        await pool.execute(sql, [
            RazonSocial, 
            RUT, 
            ContactoPrincipal, 
            TelefonoContacto, 
            EmailContacto, 
            id
        ]);

        return { id, ...data };
    }

    /**
     * Desactivar abonado (Borrado lógico)
     */
    static async deactivateAbonado(id) {
        const abonado = await this.getAbonadoById(id);

        if (abonado.Activo === 0) {
            const error = new Error('El abonado ya está inactivo.');
            error.cause = 400;
            throw error;
        }

        await pool.execute('UPDATE ABONADOS SET Activo = 0 WHERE ID_Abonado = ?', [id]);
        
        return { id, message: 'Abonado desactivado correctamente' };
    }
}

module.exports = AbonadoService;