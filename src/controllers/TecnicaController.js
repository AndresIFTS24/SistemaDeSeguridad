// src/controllers/TecnicaController.js
const TecnicaService = require('../services/TecnicaService');

class TecnicaController {

    /**
     * GET /api/tecnica/dashboard-tecnico
     * Retorna OTs y contadores KPIs para la central operativa
     */
    static async getDashboardTecnico(req, res) {
        try {
            const data = await TecnicaService.getDashboardData();
            
            // Retornamos la respuesta exitosa estructurada
            return res.status(200).json({
                message: '✅ Datos técnicos obtenidos correctamente.',
                ots: data.ots,
                kpis: data.kpis
            });
            
        } catch (error) {
            console.error('ERROR en TecnicaController.getDashboardTecnico:', error.message);
            return res.status(500).json({
                message: 'Error interno del servidor al obtener el panel técnico.',
                error: error.message
            });
        }
    }
}

module.exports = TecnicaController;