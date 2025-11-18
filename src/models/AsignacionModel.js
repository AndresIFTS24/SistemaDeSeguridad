// src/models/AsignacionModel.js (CORRECCIÓN FINAL: Adaptando a Objecto de Parámetros @pN)

const { executeQuery } = require('../config/db.config');

/**
 * Convierte un array posicional de valores a un objeto de parámetros nombrados 
 * que espera mssql/db.config.js: { p1: valor1, p2: valor2, ... }
 */
const arrayToNamedParams = (paramsArray) => {
    return paramsArray.reduce((acc, value, index) => {
        // Los placeholders en la query son @p1, @p2, etc.
        acc[`p${index + 1}`] = value; 
        return acc;
    }, {});
};

class AsignacionModel {
    
    /** Crea una nueva Orden de Trabajo (OT). */
    static async create({ ID_Direccion, ID_Tecnico, TipoOT, Descripcion, FechaProgramada, Estado = 'Programada' }) {
        const query = `
            INSERT INTO ASIGNACIONES (ID_Direccion, ID_Tecnico, TipoOT, Descripcion, FechaProgramada, Estado)
            OUTPUT 
                INSERTED.ID_Asignacion, INSERTED.ID_Direccion, INSERTED.ID_Tecnico, 
                INSERTED.TipoOT, INSERTED.FechaProgramada
            VALUES (@p1, @p2, @p3, @p4, @p5, @p6)
        `;
        const paramsArray = [ID_Direccion, ID_Tecnico, TipoOT, Descripcion, FechaProgramada, Estado];
        
        // 🚨 CORRECCIÓN: Convertir a objeto nombrado
        const namedParams = arrayToNamedParams(paramsArray); 

        const result = await executeQuery(query, namedParams);
        return result[0];
    }
    
    /** Obtiene todas las Asignaciones/OTs. */
    static async findAll() {
        const query = `
            SELECT 
                A.ID_Asignacion, A.TipoOT, A.Descripcion, A.FechaProgramada, A.Estado,
                A.FechaInicioReal, A.FechaFinReal,
                D.ID_Direccion, D.Calle, D.Numero, 
                U.ID_Usuario AS ID_Tecnico, U.Nombre 
            FROM ASIGNACIONES A
            JOIN DIRECCIONES D ON A.ID_Direccion = D.ID_Direccion
            JOIN USUARIOS U ON A.ID_Tecnico = U.ID_Usuario
            ORDER BY A.FechaProgramada DESC
        `;
        return executeQuery(query, {}); // Objeto vacío para consistencia
    }

    /** Busca una Asignación/OT por su ID. */
    static async findById(id) {
        const query = `
            SELECT 
                A.ID_Asignacion, A.TipoOT, A.Descripcion, A.FechaProgramada, A.Estado,
                D.ID_Direccion, D.Calle, D.Numero, 
                U.ID_Usuario AS ID_Tecnico, U.Nombre 
            FROM ASIGNACIONES A
            JOIN DIRECCIONES D ON A.ID_Direccion = D.ID_Direccion
            JOIN USUARIOS U ON A.ID_Tecnico = U.ID_Usuario
            WHERE A.ID_Asignacion = @p1
        `;
        const paramsArray = [id];

        // 🚨 CORRECCIÓN: Convertir a objeto nombrado
        const namedParams = arrayToNamedParams(paramsArray);
        
        const result = await executeQuery(query, namedParams);
        return result[0];
    }

    /** Actualiza campos de una Orden de Trabajo. */
    static async update(id, updates, params) {
        
        // El array 'updates' viene del service con 'NombreCampo = ?'
        // El array 'params' viene con los valores de esos campos.
        
        // 1. Agregamos el ID al final del array de parámetros, que será el último placeholder.
        params.push(id); 

        // 2. Reemplazamos todos los '?' por los placeholders posicionales @p1, @p2, etc.
        let dynamicQuery = `
            UPDATE ASIGNACIONES 
            SET ${updates.join(', ')}
            OUTPUT INSERTED.ID_Asignacion, INSERTED.TipoOT, INSERTED.Descripcion, INSERTED.FechaProgramada, INSERTED.Estado
            WHERE ID_Asignacion = ?
        `;

        const finalQuery = dynamicQuery.split('?').map((segment, index) => {
            if (index < params.length) {
                return segment + `@p${index + 1}`;
            }
            return segment;
        }).join('');
        
        // 🚨 CORRECCIÓN: Convertir a objeto nombrado
        const namedParams = arrayToNamedParams(params); 

        const result = await executeQuery(finalQuery, namedParams);
        return result[0];
    }
    
    /** Método de compatibilidad para evitar errores. */
    static async findActiveByDispositivoId(ID_Dispositivo) {
        // Si esta función se necesita, habría que implementarla correctamente:
        // const query = 'SELECT ... WHERE ID_Dispositivo = @p1 AND Estado <> \'Finalizada\'';
        // return executeQuery(query, arrayToNamedParams([ID_Dispositivo]));
        return null;
    }
    
    /** Finaliza una Orden de Trabajo. */
    static async deactivate(id) {
        const query = `
            UPDATE ASIGNACIONES 
            SET Estado = 'Finalizada', FechaFinReal = GETDATE()
            OUTPUT INSERTED.ID_Asignacion, INSERTED.Estado, INSERTED.FechaFinReal
            WHERE ID_Asignacion = @p1 AND Estado <> 'Finalizada' 
            -- 🚨 Nota: Cambié DELETED a INSERTED en OUTPUT para obtener los valores finales.
        `;
        const paramsArray = [id];

        // 🚨 CORRECCIÓN: Convertir a objeto nombrado
        const namedParams = arrayToNamedParams(paramsArray); 
        
        const result = await executeQuery(query, namedParams);
        return result[0];
    }
}

module.exports = AsignacionModel;