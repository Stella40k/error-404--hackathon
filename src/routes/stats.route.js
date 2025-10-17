import { Router } from "express";
import {
    getReportsByProblemType,
    getReportsForExport,
    getHourlyGravedadCorrelation,
    getDailyGravedadCorrelation,
} from "../controllers/StatsController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// router.get("/type", getReportsByProblemType);
router.get("/type", getReportsByProblemType);

router.get("/export_all", (req, res, next) => {
    console.log("🟡 Ruta /export_all siendo ejecutada");
    next();
}, getReportsForExport);

// Ruta protegida para correlación hora-gravedad
router.get("/hourly_gravedad", (req, res, next) => {
    console.log("🕐 Ruta /hourly_gravedad siendo ejecutada");
    next();
}, getHourlyGravedadCorrelation);

// Ruta protegida para correlación día-gravedad (con authMiddleware)
router.get("/daily_gravedad", authMiddleware, (req, res, next) => {
    console.log("📅 Ruta /daily_gravedad siendo ejecutada");
    next();
}, getDailyGravedadCorrelation);

export default router;