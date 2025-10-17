import { Router } from "express";
import authRoutes from "./auth.routes.js";
import taskRoutes from "./task.routes.js";
import statsRoutes from "./stats.route.js";
import alertasRoutes from "./alertas.route.js";
import quickReportRoutes from "./quickReport.route.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas públicas
router.use("/auth", authRoutes);
router.use("/alerts", alertasRoutes); // Ruta pública para alertas silenciosas
router.use("/quick", quickReportRoutes); // Ruta pública para reporte rápido

// Rutas protegidas
router.use("/tasks", taskRoutes);
router.use("/stats", authMiddleware, statsRoutes); // Protegida con authMiddleware

export default router;
