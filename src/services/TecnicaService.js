// src/services/TecnicaService.js
// Importamos 'pool' desestructurado del archivo correcto, igual que en AbonadoService
const { pool } = require('../config/db.config'); 

class TecnicaService {
    
    /**
     * Trae los datos crudos para el panel técnico
     */
    static async getDashboardData() {
        try {
            // 1. Traer Órdenes de Trabajo (OT) usando .execute()
            const [ots] = await pool.execute(`
                SELECT id_ot, abonado, nro_abonado, urgencia, estado, tecnico, tipo_tarea 
                FROM ordenes_trabajo 
                ORDER BY id_ot DESC
            `);

            // 2. Traer Contadores para los KPIs usando .execute()
            const [[kpis]] = await pool.execute(`
                SELECT 
                    (SELECT COUNT(*) FROM usuarios WHERE id_sector = 5 AND activo = 1) as tecnicosCampo,
                    (SELECT COUNT(*) FROM ordenes_trabajo WHERE estado = 'Pendiente') as otsPendientes,
                    (SELECT COUNT(*) FROM ordenes_trabajo WHERE DATE(fecha_programada) = CURDATE()) as otsHoy,
                    (SELECT COUNT(*) FROM ordenes_trabajo WHERE estado = 'Demorada') as otsDemoradas
                FROM DUAL
            `);

            return {
                ots: ots || [],
                kpis: {
                    tecnicosCampo: kpis?.tecnicosCampo || 0,
                    otsPendientes: kpis?.otsPendientes || 0,
                    otsHoy: kpis?.otsHoy || 0,
                    otsDemoradas: kpis?.otsDemoradas || 0
                }
            };
        } catch (error) {
            console.error('❌ Error en TecnicaService.getDashboardData:', error.message);
            throw error;
        }
    }
}

module.exports = TecnicaService;