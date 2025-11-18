// src/models/UserModel.js (COMPLETO Y FINAL PARA MSSQL)

const { executeQuery } = require('../config/db.config');

class UserModel {
    
    /** Crea un nuevo usuario. */
    static async create({ nombre, email, passwordHash, telefono, idSector, idRol }) {
        const query = `
            INSERT INTO USUARIOS (Nombre, Email, PasswordHash, Telefono, ID_Sector, ID_Rol, Activo)
            OUTPUT INSERTED.ID_Usuario, INSERTED.Nombre, INSERTED.Email, INSERTED.ID_Rol
            VALUES (@Nombre, @Email, @PasswordHash, @Telefono, @ID_Sector, @ID_Rol, 1)
        `;
        const params = { 
            Nombre: nombre, 
            Email: email, 
            PasswordHash: passwordHash, 
            Telefono: telefono, 
            ID_Sector: idSector, 
            ID_Rol: idRol 
        };
        const result = await executeQuery(query, params);
        return result[0];
    }
    
    /** Obtiene todos los usuarios, uniendo Rol y Sector (sin hash de contraseña). */
    static async findAll() {
        const query = `
            SELECT 
                U.ID_Usuario, U.Nombre, U.Email, U.Telefono, U.Activo, 
                R.NombreRol, S.NombreSector
            FROM USUARIOS U
            JOIN ROLES R ON U.ID_Rol = R.ID_Rol
            LEFT JOIN SECTORES S ON U.ID_Sector = S.ID_Sector
            ORDER BY U.Nombre
        `;
        return executeQuery(query);
    }
    
    /** Obtiene solo usuarios activos. */
    static async findActive() {
        const query = `
            SELECT 
                U.ID_Usuario, U.Nombre, U.Email, U.Telefono, U.Activo, 
                R.NombreRol, S.NombreSector
            FROM USUARIOS U
            JOIN ROLES R ON U.ID_Rol = R.ID_Rol
            LEFT JOIN SECTORES S ON U.ID_Sector = S.ID_Sector
            WHERE U.Activo = 1
            ORDER BY U.Nombre
        `;
        return executeQuery(query);
    }

    /** Busca un usuario por ID (sin hash de contraseña). */
    static async findById(id) {
        const query = `
            SELECT 
                U.ID_Usuario, U.Nombre, U.Email, U.Telefono, U.Activo, U.ID_Rol, U.ID_Sector,
                R.NombreRol, S.NombreSector
            FROM USUARIOS U
            JOIN ROLES R ON U.ID_Rol = R.ID_Rol
            LEFT JOIN SECTORES S ON U.ID_Sector = S.ID_Sector
            WHERE U.ID_Usuario = @ID_Usuario -- ✔️ CORRECTO
        `;
        const result = await executeQuery(query, { ID_Usuario: id }); 
        return result[0];
    }

    /** 🔑 CRÍTICO PARA EL LOGIN: Busca un usuario por email, incluyendo el HASH de contraseña y el Rol. */
    static async findByEmailForAuth(email) {
        const query = `
            SELECT 
                U.ID_Usuario, U.Email, U.Nombre, U.PasswordHash, U.Activo, 
                R.NombreRol
            FROM USUARIOS U
            JOIN ROLES R ON U.ID_Rol = R.ID_Rol
            WHERE U.Email = @Email -- ✔️ CORRECTO
        `;
        const result = await executeQuery(query, { Email: email });
        return result[0];
    }
    
    /** Actualiza campos de un usuario. */
    static async update(id, updates, params) {
        // updates es un array de strings (ej: ["Nombre = @Nombre", "Email = @Email"])
        const query = `
            UPDATE USUARIOS 
            SET ${updates.join(', ')}
            OUTPUT INSERTED.ID_Usuario, INSERTED.Nombre, INSERTED.Email, INSERTED.Activo
            WHERE ID_Usuario = @ID_Usuario -- ✔️ CORRECTO
        `;
        // Agregamos el ID para la cláusula WHERE al objeto de parámetros
        const finalParams = { ...params, ID_Usuario: id };
        const result = await executeQuery(query, finalParams);
        return result[0];
    }

    /** Realiza una eliminación lógica (Soft Delete: Activo = 0). */
    static async softDelete(id) {
        const query = `
            UPDATE USUARIOS 
            SET Activo = 0 
            OUTPUT DELETED.ID_Usuario, DELETED.Nombre, INSERTED.Activo
            WHERE ID_Usuario = @ID_Usuario AND Activo = 1 -- ✔️ CORRECTO
        `;
        const result = await executeQuery(query, { ID_Usuario: id }); 
        return result[0];
    }
}

module.exports = UserModel;