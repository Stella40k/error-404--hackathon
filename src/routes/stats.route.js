import { Router } from "express";
import {
    getReportsByProblemType,
    getReportsForExport,
    getHourlyGravedadCorrelation,
    getDailyGravedadCorrelation,
    getReportsByCategoria,
    getSubcategoriasByCategoria
} from "../controllers/StatsController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Estadísticas por tipo de problema
router.get("/type", getReportsByProblemType);

// Estadísticas por categoría principal
router.get("/categoria", getReportsByCategoria);

// Obtener subcategorías por categoría
router.get("/subcategorias", getSubcategoriasByCategoria);

// Exportar reportes
router.get("/export_all", getReportsForExport);

// Correlaciones
router.get("/hourly_gravedad", getHourlyGravedadCorrelation);
router.get("/daily_gravedad", authMiddleware, getDailyGravedadCorrelation);

export default router;