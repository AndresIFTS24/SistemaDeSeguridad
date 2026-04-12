/**
 * OPTIMUS - MÓDULO DE USUARIOS (CRUD COMPLETO)
 * Archivo: src/routes/user.routes.js
 * Descripción: Gestión integral de usuarios con visibilidad de PasswordHash para auditoría.
 */

const express = require('express');
const router = express.Router();
const { pool } = require('../config/db.config');
const bcrypt = require('bcrypt');
// ====================================================================
// 1. OBTENER TODOS LOS USUARIOS (READ ALL)
// Omitimos PasswordHash por seguridad (Principio de mínimo privilegio)
// ====================================================================
router.get('/usuarios', async (req, res) => {
    try {
        // Quitamos PasswordHash de aquí para que nadie pueda verla, ni hasheada ni plana.
        const query = 'SELECT ID_Usuario, Nombre, Email, Telefono, ID_Rol, ID_Sector FROM USUARIOS';
        const [rows] = await pool.execute(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al listar usuarios", details: error.message });
    }
});

// ====================================================================
// 2. OBTENER UN USUARIO POR ID
// ====================================================================
router.get('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'SELECT ID_Usuario, Nombre, Email, Telefono, ID_Rol, ID_Sector FROM USUARIOS WHERE ID_Usuario = ?';
        const [rows] = await pool.execute(query, [id]);
        
        if (rows.length === 0) return res.status(404).json({ mensaje: "Usuario no encontrado" });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el usuario", details: error.message });
    }
});

// ====================================================================
// 3. CREAR USUARIO (CON LOG PARA DEPURACIÓN)
router.post('/usuarios', async (req, res) => {
    const { Nombre, Email, PasswordHash, Telefono, ID_Sector, ID_Rol } = req.body;

    if (!Nombre || !Email || !PasswordHash || !ID_Rol) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    try {
        console.log("Iniciando registro para:", Email); // Ver esto en consola
        
        // Hasheo explícito
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(PasswordHash, salt);
        
        console.log("Hash generado con éxito:", hash); // Si ves esto en la consola, funciona.

        const query = "INSERT INTO USUARIOS (Nombre, Email, PasswordHash, Telefono, ID_Sector, ID_Rol) VALUES (?, ?, ?, ?, ?, ?)";
        const [result] = await pool.execute(query, [Nombre, Email, hash, Telefono, ID_Sector, ID_Rol]);

        res.status(201).json({ 
            mensaje: "✅ Usuario creado con éxito y encriptado.",
            id: result.insertId 
        });
    } catch (error) {
        console.error("Error en POST /usuarios:", error);
        res.status(500).json({ error: error.message });
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