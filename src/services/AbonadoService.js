// src/services/AbonadoService.js
const { pool } = require('../config/db.config');

class AbonadoService {

    /**
     * Crear un nuevo abonado
     * Incluye NumeroDeAbonado y validaciones de duplicados
     */
    static async createAbonado(data) {
        const { NumeroDeAbonado, RazonSocial, RUT, ContactoPrincipal, TelefonoContacto, EmailContacto } = data;

        // 1. Validar si el NumeroDeAbonado o RUT ya existen
        const [existing] = await pool.execute(
            'SELECT NumeroDeAbonado, RUT FROM ABONADOS WHERE NumeroDeAbonado = ? OR (RUT IS NOT NULL AND RUT = ?)',
            [NumeroDeAbonado, RUT || null]
        );

        if (existing.length > 0) {
            const isNro = existing.some(a => a.NumeroDeAbonado === NumeroDeAbonado);
            const error = new Error(isNro ? 'El Número de Abonado ya existe.' : 'El RUT ya se encuentra registrado.');
            error.cause = 409;
            throw error;
        }

        // 2. Insertar en la base de datos
        const sql = `
            INSERT INTO ABONADOS (NumeroDeAbonado, RazonSocial, RUT, ContactoPrincipal, TelefonoContacto, EmailContacto, Activo) 
            VALUES (?, ?, ?, ?, ?, ?, 1)
        `;
        
        const [result] = await pool.execute(sql, [
            NumeroDeAbonado,
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
     * Obtener todos los abonados (Ordenados por fecha de alta reciente)
     */
    static async getAllAbonados() {
        const [rows] = await pool.execute('SELECT * FROM ABONADOS ORDER BY FechaAlta DESC');
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
     * Obtener un abonado por su número de cuenta (Muy usado en Monitoreo)
     */
    static async getAbonadoByAccountNumber(nro) {
        const [rows] = await pool.execute('SELECT * FROM ABONADOS WHERE NumeroDeAbonado = ?', [nro]);
        if (rows.length === 0) return null;
        return rows[0];
    }

    /**
     * Actualizar datos del abonado
     */
    static async updateAbonado(id, data) {
        const { NumeroDeAbonado, RazonSocial, RUT, ContactoPrincipal, TelefonoContacto, EmailContacto, Activo } = data;

        // Verificar si existe el abonado
        await this.getAbonadoById(id);

        const sql = `
            UPDATE ABONADOS 
            SET NumeroDeAbonado = ?, RazonSocial = ?, RUT = ?, ContactoPrincipal = ?, TelefonoContacto = ?, EmailContacto = ?, Activo = ?
            WHERE ID_Abonado = ?
        `;

        await pool.execute(sql, [
            NumeroDeAbonado,
            RazonSocial, 
            RUT, 
            ContactoPrincipal, 
            TelefonoContacto, 
            EmailContacto, 
            Activo !== undefined ? Activo : 1,
            id
        ]);

        return { id, ...data };
    }

    /**
     * Alternar estado Activo/Inactivo (Borrado lógico)
     */
    static async toggleStatus(id) {
        const abonado = await this.getAbonadoById(id);
        const nuevoEstado = abonado.Activo === 1 ? 0 : 1;

        await pool.execute('UPDATE ABONADOS SET Activo = ? WHERE ID_Abonado = ?', [nuevoEstado, id]);
        
        return { 
            id, 
            activo: nuevoEstado, 
            message: nuevoEstado === 1 ? 'Abonado reactivado' : 'Abonado desactivado' 
        };
    }

    /**
     * Buscar abonados (Para buscadores en el frontend)
     */
    static async searchAbonados(termino) {
        const query = `
            SELECT * FROM ABONADOS 
            WHERE RazonSocial LIKE ? OR NumeroDeAbonado LIKE ? OR RUT LIKE ?
            LIMIT 20
        `;
        const t = `%${termino}%`;
        const [rows] = await pool.execute(query, [t, t, t]);
        return rows;
    }
}

module.exports = AbonadoService;