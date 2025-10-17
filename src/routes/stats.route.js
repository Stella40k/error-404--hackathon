import { Router } from "express";
import {
    getReportsByProblemType,
    getReportsForExport,
} from "../controllers/StatsController.js";

const router = Router();

// router.get("/type", getReportsByProblemType);
router.get("/type", getReportsByProblemType);

router.get("/export_all", (req, res, next) => {
    console.log("🟡 Ruta /export_all siendo ejecutada");
    next();
}, getReportsForExport);

export default router;