/**
 * OPTIMUS - MÓDULO DE USUARIOS (CRUD COMPLETO)
 * Archivo: src/routes/user.routes.js
 * Descripción: Gestión integral de usuarios con visibilidad de PasswordHash para auditoría.
 */

const express = require('express');
const router = express.Router();
const { pool } = require('../config/db.config');

// ====================================================================
// 1. OBTENER TODOS LOS USUARIOS (READ ALL)
// Incluye el PasswordHash para verificar la persistencia en Clever Cloud
// ====================================================================
router.get('/usuarios', async (req, res) => {
    try {
        // Hemos agregado 'PasswordHash' a la consulta SQL
        const query = 'SELECT ID_Usuario, Nombre, Email, PasswordHash, Telefono, ID_Rol, ID_Sector FROM USUARIOS';
        const [rows] = await pool.execute(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ 
            error: "Error al listar usuarios", 
            details: error.message 
        });
    }
});

// ====================================================================
// 2. OBTENER UN USUARIO POR ID (READ SINGLE)
// ====================================================================
router.get('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // También incluimos PasswordHash en la búsqueda individual
        const query = 'SELECT ID_Usuario, Nombre, Email, PasswordHash, Telefono, ID_Rol, ID_Sector FROM USUARIOS WHERE ID_Usuario = ?';
        const [rows] = await pool.execute(query, [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ 
            error: "Error al obtener el usuario", 
            details: error.message 
        });
    }
});

// ====================================================================
// 3. CREAR NUEVO USUARIO (CREATE)
// Punto 7.2: Asegura que el Hash se guarde correctamente en la BD
// ====================================================================
router.post('/usuarios', async (req, res) => {
    const { Nombre, Email, PasswordHash, Telefono, ID_Sector, ID_Rol } = req.body;

    // Validación de integridad de datos
    if (!Nombre || !Email || !PasswordHash || !ID_Rol) {
        return res.status(400).json({ 
            error: "Faltan datos obligatorios",
            campos_requeridos: ["Nombre", "Email", "PasswordHash", "ID_Rol"] 
        });
    }

    try {
        const query = "INSERT INTO USUARIOS (Nombre, Email, PasswordHash, Telefono, ID_Sector, ID_Rol) VALUES (?, ?, ?, ?, ?, ?)";
        const [result] = await pool.execute(query, [Nombre, Email, PasswordHash, Telefono, ID_Sector, ID_Rol]);

        res.status(201).json({ 
            mensaje: "✅ Usuario creado con éxito en OPTIMUS", 
            id_creado: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ 
            error: "Error al insertar en la base de datos", 
            details: error.message 
        });
    }
});

// ====================================================================
// 4. ACTUALIZAR USUARIO (UPDATE)
// ====================================================================
router.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { Nombre, Email, ID_Rol } = req.body;

    if (!Nombre || !Email || !ID_Rol) {
        return res.status(400).json({ error: "Nombre, Email e ID_Rol son necesarios para la actualización." });
    }

    try {
        const query = "UPDATE USUARIOS SET Nombre = ?, Email = ?, ID_Rol = ? WHERE ID_Usuario = ?";
        const [result] = await pool.execute(query, [Nombre, Email, ID_Rol, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "No se encontró el usuario para actualizar" });
        }

        res.json({ mensaje: "✅ Usuario actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ 
            error: "Error en la actualización", 
            details: error.message 
        });
    }
});

// ====================================================================
// 5. ELIMINAR USUARIO (DELETE)
// ====================================================================
router.delete('/usuarios/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = "DELETE FROM USUARIOS WHERE ID_Usuario = ?";
        const [result] = await pool.execute(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "❌ El usuario no existe o ya fue eliminado." });
        }

        res.json({ mensaje: "✅ Usuario eliminado del sistema" });
    } catch (error) {
        res.status(500).json({ 
            error: "Fallo de integridad referencial", 
            details: "No se puede eliminar un usuario con registros asociados en otras tablas." 
        });
    }
});

module.exports = router;