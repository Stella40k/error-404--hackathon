import { Router } from "express";
import {
    getReportsByProblemType,
    getReportsForExport,
} from "../controllers/StatsController.js";

const router = Router();

// Quitamos /api/stats ya que esto se define en app.js (Rutas Barril)
router.get("/by_type", getReportsByProblemType);

router.get("/export_all", getReportsForExport);

export default router;
