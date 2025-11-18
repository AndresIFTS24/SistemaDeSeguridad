// src/models/ModeloDispositivoModel.js (CORRECCIÓN FINAL: Adaptando a Objecto de Parámetros)

const { executeQuery } = require('../config/db.config');

/** * Convierte un array posicional de valores a un objeto de parámetros nombrados 
 * que espera mssql/db.config.js: { p1: valor1, p2: valor2, ... }
 */
const arrayToNamedParams = (paramsArray) => {
    return paramsArray.reduce((acc, value, index) => {
        // Los placeholders en la query son @p1, @p2, etc.
        acc[`p${index + 1}`] = value; 
        return acc;
    }, {});
};

class ModeloDispositivoModel {
    
    /** Crea un nuevo modelo de dispositivo. */
    static async create({ nombreModelo, fabricante, tipoDispositivo }) {
        const query = `
            INSERT INTO MODELOS_DISPOSITIVOS (NombreModelo, Fabricante, TipoDispositivo)
            OUTPUT INSERTED.ID_Modelo, INSERTED.NombreModelo, INSERTED.Fabricante, INSERTED.TipoDispositivo
            VALUES (@p1, @p2, @p3)
        `;
        const paramsArray = [nombreModelo, fabricante, tipoDispositivo];
        // 🚨 CORRECCIÓN: Convertir el array a objeto de parámetros nombrados
        const namedParams = arrayToNamedParams(paramsArray); 
        
        const result = await executeQuery(query, namedParams);
        return result[0];
    }
    
    /** Obtiene todos los modelos. */
    static async findAll() {
        // No necesita parámetros.
        const query = 'SELECT ID_Modelo, NombreModelo, Fabricante, TipoDispositivo FROM MODELOS_DISPOSITIVOS ORDER BY NombreModelo';
        return executeQuery(query, {}); // Asegurar que siempre se pasa un objeto vacío si no hay params
    }

    /** Busca un modelo por su ID. */
    static async findById(id) {
        const query = 'SELECT ID_Modelo, NombreModelo, Fabricante, TipoDispositivo FROM MODELOS_DISPOSITIVOS WHERE ID_Modelo = @p1';
        const paramsArray = [id];
        // 🚨 CORRECCIÓN: Convertir el array a objeto de parámetros nombrados
        const namedParams = arrayToNamedParams(paramsArray);
        
        const result = await executeQuery(query, namedParams);
        return result[0];
    }
    
    /** Actualiza campos de un modelo. */
    static async update(id, updates, params) {
        // 1. Revertimos la lógica de reemplazo en el Service para usar '?' de nuevo, 
        //    ya que el Service construye 'NombreCampo = ?'. 
        //    Y luego convertiremos a @p1, @p2, etc.

        // El array 'updates' viene del service con 'NombreCampo = ?'
        // El array 'params' viene con los valores de esos campos.
        
        // El service siempre agrega el ID al final del array 'params'.
        params.push(id); 

        // 2. Reemplazamos los '?' posicionales por @p[N] en la query.
        let dynamicQuery = `
            UPDATE MODELOS_DISPOSITIVOS 
            SET ${updates.join(', ')}
            OUTPUT INSERTED.ID_Modelo, INSERTED.NombreModelo, INSERTED.Fabricante, INSERTED.TipoDispositivo
            WHERE ID_Modelo = ?
        `;

        // Ahora, reemplazamos '?' por los placeholders @p1, @p2, etc.
        const finalQuery = dynamicQuery.split('?').map((segment, index) => {
            if (index < params.length) {
                return segment + `@p${index + 1}`;
            }
            return segment;
        }).join('');

        // 🚨 CORRECCIÓN: Convertir el array a objeto de parámetros nombrados
        const namedParams = arrayToNamedParams(params);
        
        const result = await executeQuery(finalQuery, namedParams);
        return result[0];
    }

    /** Elimina un modelo (Borrado físico). */
    static async delete(id) {
        // La consulta debe usar @p1, pero el Service envía un array [id]
        const query = 'DELETE FROM MODELOS_DISPOSITIVOS OUTPUT DELETED.ID_Modelo, DELETED.NombreModelo WHERE ID_Modelo = @p1';
        const paramsArray = [id];
        
        // 🚨 CORRECCIÓN: Convertir el array a objeto de parámetros nombrados
        const namedParams = arrayToNamedParams(paramsArray);
        
        const result = await executeQuery(query, namedParams);
        return result[0];
    }
}

module.exports = ModeloDispositivoModel;