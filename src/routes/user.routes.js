/**
 * OPTIMUS - MÓDULO DE USUARIOS
 * Archivo: user.routes.js
 * Descripción: CRUD completo para la gestión de usuarios en la tabla USUARIOS.
 */

const express = require('express');
const router = express.Router();
const { pool } = require('../config/db.config');

// ====================================================================
// 1. OBTENER TODOS LOS USUARIOS (READ)
// ====================================================================
router.get('/usuarios', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT ID_Usuario, Nombre, Email, Telefono, ID_Rol, ID_Sector FROM USUARIOS');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener usuarios", details: error.message });
    }
});

// ====================================================================
// 2. OBTENER UN USUARIO POR ID (READ SINGLE)
// ====================================================================
router.get('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'SELECT ID_Usuario, Nombre, Email, Telefono, ID_Rol, ID_Sector FROM USUARIOS WHERE ID_Usuario = ?';
        const [rows] = await pool.execute(query, [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el usuario", details: error.message });
    }
});

// ====================================================================
// 3. CREAR USUARIO (CREATE)
// ====================================================================
router.post('/usuarios', async (req, res) => {
    const { Nombre, Email, PasswordHash, Telefono, ID_Sector, ID_Rol } = req.body;

    // Validación de campos obligatorios para evitar errores de MySQL
    if (!Nombre || !Email || !PasswordHash || !ID_Rol) {
        return res.status(400).json({ error: "Faltan datos obligatorios (Nombre, Email, PasswordHash, ID_Rol)" });
    }

    try {
        const query = "INSERT INTO USUARIOS (Nombre, Email, PasswordHash, Telefono, ID_Sector, ID_Rol) VALUES (?, ?, ?, ?, ?, ?)";
        const [result] = await pool.execute(query, [Nombre, Email, PasswordHash, Telefono, ID_Sector, ID_Rol]);

        res.status(201).json({ 
            mensaje: "✅ Usuario creado con éxito", 
            id_creado: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ error: "Error al crear usuario", details: error.message });
    }
});

// ====================================================================
// 4. ACTUALIZAR USUARIO (UPDATE)
// ====================================================================
router.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { Nombre, Email, ID_Rol } = req.body;

    if (!Nombre || !Email || !ID_Rol) {
        return res.status(400).json({ 
            error: "Faltan datos", 
            message: "Asegúrate de enviar Nombre, Email e ID_Rol" 
        });
    }

    try {
        const query = "UPDATE USUARIOS SET Nombre = ?, Email = ?, ID_Rol = ? WHERE ID_Usuario = ?";
        const [result] = await pool.execute(query, [Nombre, Email, ID_Rol, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "No se encontró el usuario con el ID especificado" });
        }

        res.json({ mensaje: "✅ Usuario actualizado con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error de base de datos", details: error.message });
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
            return res.status(404).json({ mensaje: "❌ No se encontró el usuario para eliminar." });
        }

        res.json({ mensaje: "✅ Usuario eliminado correctamente del sistema OPTIMUS" });
    } catch (error) {
        res.status(500).json({ 
            error: "Error de integridad", 
            details: "El usuario tiene datos vinculados (historial/asignaciones) que impiden su borrado físico." 
        });
    }
});

module.exports = router;