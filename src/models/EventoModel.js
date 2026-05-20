// src/models/EventoModel.js
const { pool } = require('../config/db.config');

class EventoModel {

    static async create({ ID_Dispositivo, ID_CodigoEvento, Estado = 'Pendiente' }) {
        const sql = `
            INSERT INTO EVENTOS (ID_Dispositivo, ID_CodigoEvento, FechaHoraRecepcion, Estado)
            VALUES (?, ?, NOW(), ?)
        `;
        const [result] = await pool.execute(sql, [ID_Dispositivo, ID_CodigoEvento, Estado]);
        
        const [rows] = await pool.execute(
            'SELECT * FROM EVENTOS WHERE ID_Evento = ?', 
            [result.insertId]
        );
        return rows[0];
    }

    static async findAll() {
        const sql = `
            SELECT 
                E.ID_Evento,
                E.FechaHoraRecepcion,
                E.Estado,
                E.ID_Dispositivo,
                D.NumeroSerie AS SerieDispositivo,
                D.NombreDispositivo,
                MD.NombreModelo,
                CE.Codigo AS TipoEvento,
                CE.DescripcionAlarma AS DescripcionEvento,
                CE.Prioridad AS NivelCriticidad,
                AB.RazonSocial AS NombreAbonado,
                AB.NumeroDeAbonado
            FROM EVENTOS E
            JOIN DISPOSITIVOS D ON E.ID_Dispositivo = D.ID_Dispositivo
            JOIN MODELOS_DISPOSITIVOS MD ON D.ID_Modelo = MD.ID_Modelo
            JOIN CODIGOS_EVENTOS CE ON E.ID_CodigoEvento = CE.ID_CodigoEvento
            JOIN DIRECCIONES DIR ON D.ID_Direccion = DIR.ID_Direccion
            JOIN ABONADOS AB ON DIR.ID_Abonado = AB.ID_Abonado
            ORDER BY E.FechaHoraRecepcion DESC
        `;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async findById(id) {
        const sql = `
            SELECT 
                E.ID_Evento,
                E.FechaHoraRecepcion,
                E.Estado,
                E.ID_Dispositivo,
                D.NumeroSerie AS SerieDispositivo,
                D.NombreDispositivo,
                MD.NombreModelo,
                CE.Codigo AS TipoEvento,
                CE.DescripcionAlarma AS DescripcionEvento,
                CE.Prioridad AS NivelCriticidad,
                AB.RazonSocial AS NombreAbonado,
                AB.NumeroDeAbonado
            FROM EVENTOS E
            JOIN DISPOSITIVOS D ON E.ID_Dispositivo = D.ID_Dispositivo
            JOIN MODELOS_DISPOSITIVOS MD ON D.ID_Modelo = MD.ID_Modelo
            JOIN CODIGOS_EVENTOS CE ON E.ID_CodigoEvento = CE.ID_CodigoEvento
            JOIN DIRECCIONES DIR ON D.ID_Direccion = DIR.ID_Direccion
            JOIN ABONADOS AB ON DIR.ID_Abonado = AB.ID_Abonado
            WHERE E.ID_Evento = ?
        `;
        const [rows] = await pool.execute(sql, [id]);
        return rows[0];
    }

    static async updateEstado(id, estado) {
        await pool.execute(
            'UPDATE EVENTOS SET Estado = ? WHERE ID_Evento = ?',
            [estado, id]
        );
        return this.findById(id);
    }

    static async findByDispositivoId(id) {
        const sql = `
            SELECT 
                E.ID_Evento,
                E.FechaHoraRecepcion,
                E.Estado,
                CE.Codigo AS TipoEvento,
                CE.DescripcionAlarma AS DescripcionEvento,
                CE.Prioridad AS NivelCriticidad
            FROM EVENTOS E
            JOIN CODIGOS_EVENTOS CE ON E.ID_CodigoEvento = CE.ID_CodigoEvento
            WHERE E.ID_Dispositivo = ?
            ORDER BY E.FechaHoraRecepcion DESC
        `;
        const [rows] = await pool.execute(sql, [id]);
        return rows;
    }

    static async delete(id) {
        const evento = await this.findById(id);
        await pool.execute('DELETE FROM EVENTOS WHERE ID_Evento = ?', [id]);
        return evento;
    }
}

module.exports = EventoModel;