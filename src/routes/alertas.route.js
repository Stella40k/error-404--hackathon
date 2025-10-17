import { Router } from "express";
import { registerSilentAlert } from "../controllers/AlertaController.js";

const router = Router();

// Ruta PÚBLICA para registrar alertas silenciosas de acoso
// POST /api/alerts/acoso - No requiere autenticación
router.post("/acoso", (req, res, next) => {
  console.log("🚨 Ruta POST /acoso siendo ejecutada");
  next();
}, registerSilentAlert);

export default router;
