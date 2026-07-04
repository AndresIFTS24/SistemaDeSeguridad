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
     * 🎯 OPTIMIZADO CON LEFT JOIN:
     * Obtener todos los abonados trayendo dinámicamente sus locaciones reales desde la tabla DIRECCIONES
     */
    static async getAllAbonados() {
        const query = `
            SELECT a.*, d.Calle, d.Numero, d.Ciudad 
            FROM ABONADOS a
            LEFT JOIN DIRECCIONES d ON a.ID_Abonado = d.ID_Abonado
            ORDER BY a.FechaAlta DESC
        `;
        const [rows] = await pool.execute(query);
        return rows;
    }

    /**
     * 🎯 OPTIMIZADO CON LEFT JOIN:
     * Obtener un abonado por ID cruzando su dirección real
     */
    static async getAbonadoById(id) {
        const query = `
            SELECT a.*, d.Calle, d.Numero, d.Ciudad 
            FROM ABONADOS a
            LEFT JOIN DIRECCIONES d ON a.ID_Abonado = d.ID_Abonado
            WHERE a.ID_Abonado = ?
        `;
        const [rows] = await pool.execute(query, [id]);
        
        if (rows.length === 0) {
            const error = new Error('Abonado no encontrado.');
            error.cause = 404;
            throw error;
        }
        return rows[0];
    }

    /**
     * 🎯 OPTIMIZADO CON LEFT JOIN:
     * Obtener un abonado por su número de cuenta integrando su dirección real
     */
    static async getAbonadoByAccountNumber(nro) {
        const query = `
            SELECT a.*, d.Calle, d.Numero, d.Ciudad 
            FROM ABONADOS a
            LEFT JOIN DIRECCIONES d ON a.ID_Abonado = d.ID_Abonado
            WHERE a.NumeroDeAbonado = ?
        `;
        const [rows] = await pool.execute(query, [nro]);
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

    static async deactivateAbonado(id) {
        const abonado = await this.getAbonadoById(id);
        
        if (abonado.Activo === 0) {
            const error = new Error('El abonado ya está inactivo.');
            error.cause = 400;
            throw error;
        }

        await pool.execute('UPDATE ABONADOS SET Activo = 0 WHERE ID_Abonado = ?', [id]);
        
        return { id, activo: 0, message: 'Abonado desactivado exitosamente.' };
    }

    /**
     * 🎯 OPTIMIZADO CON LEFT JOIN:
     * Buscar abonados cruzando direcciones
     */
    static async searchAbonados(termino) {
        const query = `
            SELECT a.*, d.Calle, d.Numero, d.Ciudad 
            FROM ABONADOS a
            LEFT JOIN DIRECCIONES d ON a.ID_Abonado = d.ID_Abonado
            WHERE a.RazonSocial LIKE ? OR a.NumeroDeAbonado LIKE ? OR a.RUT LIKE ?
            LIMIT 20
        `;
        const t = `%${termino}%`;
        const [rows] = await pool.execute(query, [t, t, t]);
        return rows;
    }
}

module.exports = AbonadoService;