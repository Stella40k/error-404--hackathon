import { Router } from "express";
import { 
  getAllReports, 
  createReport, 
  getReportById, 
  updateReport, 
  deleteReport,
  getReportStats,
  getMatrizGravedad
} from "../controllers/reporteController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas públicas (sin autenticación) - Para el Mapa UrbiVox
router.get("/reports", getAllReports); // Filtros disponibles sin auth
router.get("/reports/stats", getReportStats); // Estadísticas públicas
router.get("/reports/matriz", getMatrizGravedad); // Matriz de gravedad pública

// Rutas protegidas (requieren autenticación)
router.get("/reports/:id", authMiddleware, getReportById);
router.post("/reports", createReport); // Crear reporte (puede ser anónimo)
router.put("/reports/:id", authMiddleware, updateReport);
router.delete("/reports/:id", authMiddleware, deleteReport);

export default router;
