const { pool } = require('../config/db.config');

class DispositivoModel {

    static async findAll() {
        const sql = `
            SELECT 
                D.ID_Dispositivo, D.NumeroSerie, D.NombreDispositivo,
                D.Zona_Ubicacion, D.FechaInstalacion, D.Estado, D.ID_Direccion,
                MD.ID_Modelo, MD.NombreModelo, MD.Fabricante,
                DIR.Calle, DIR.Numero, DIR.Ciudad
            FROM DISPOSITIVOS D
            JOIN MODELOS_DISPOSITIVOS MD ON D.ID_Modelo = MD.ID_Modelo
            JOIN DIRECCIONES DIR ON D.ID_Direccion = DIR.ID_Direccion
            ORDER BY D.NombreDispositivo
        `;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async findById(id) {
        const sql = `
            SELECT 
                D.ID_Dispositivo, D.NumeroSerie, D.NombreDispositivo,
                D.Zona_Ubicacion, D.FechaInstalacion, D.Estado, D.ID_Direccion,
                MD.ID_Modelo, MD.NombreModelo, MD.Fabricante,
                DIR.Calle, DIR.Numero, DIR.Ciudad
            FROM DISPOSITIVOS D
            JOIN MODELOS_DISPOSITIVOS MD ON D.ID_Modelo = MD.ID_Modelo
            JOIN DIRECCIONES DIR ON D.ID_Direccion = DIR.ID_Direccion
            WHERE D.ID_Dispositivo = ?
        `;
        const [rows] = await pool.execute(sql, [id]);
        return rows[0];
    }

    static async create({ ID_Modelo, NumeroSerie, NombreDispositivo, Zona_Ubicacion, ID_Direccion, FechaInstalacion, Estado = 'Operativo' }) {
        const sql = `
            INSERT INTO DISPOSITIVOS (ID_Modelo, NumeroSerie, NombreDispositivo, Zona_Ubicacion, ID_Direccion, FechaInstalacion, Estado)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.execute(sql, [
            ID_Modelo, NumeroSerie, NombreDispositivo,
            Zona_Ubicacion || null, ID_Direccion, FechaInstalacion, Estado
        ]);
        return this.findById(result.insertId);
    }

    static async update(id, data) {
        const { NumeroSerie, NombreDispositivo, Zona_Ubicacion, Estado } = data;
        const sql = `
            UPDATE DISPOSITIVOS 
            SET NumeroSerie = ?, NombreDispositivo = ?, Zona_Ubicacion = ?, Estado = ?
            WHERE ID_Dispositivo = ?
        `;
        await pool.execute(sql, [NumeroSerie, NombreDispositivo, Zona_Ubicacion, Estado, id]);
        return this.findById(id);
    }

    static async softDelete(id) {
        await pool.execute(
            'UPDATE DISPOSITIVOS SET Estado = ? WHERE ID_Dispositivo = ?',
            ['Inactivo', id]
        );
        return this.findById(id);
    }
}

module.exports = DispositivoModel;