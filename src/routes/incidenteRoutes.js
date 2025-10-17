import { Router } from "express";
import { 
  createIncidente, 
  getAllIncidentes, 
  getIncidenteById, 
  updateIncidente,
  getIncidenteStats,
  getMatrizGravedad,
  createAlertaAcoso,
  getAlertasAcoso
} from "../controllers/incidenteController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas públicas (sin autenticación) - Para el Mapa UrbiVox
router.get("/incidents", getAllIncidentes); // GET /api/incidents (Público)
router.get("/incidentes/stats", getIncidenteStats); // Estadísticas públicas
router.get("/incidentes/matriz", getMatrizGravedad); // Matriz de gravedad pública

// Alerta Rápida de Acoso
router.post("/alerts/acoso", createAlertaAcoso); // POST /api/alerts/acoso (Público)
router.get("/alerts/acoso", getAlertasAcoso); // GET /api/alerts/acoso (Público)

// Rutas protegidas (requieren autenticación)
router.get("/incidentes/:id", authMiddleware, getIncidenteById);
router.post("/incidentes", createIncidente); // Crear incidente (puede ser anónimo)
router.put("/incidentes/:id", authMiddleware, updateIncidente);

export default router;
