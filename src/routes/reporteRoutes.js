import { Router } from "express";
import {
  getAllReports,
  createReport,
  getReportById,
  updateReport,
  deleteReport,
  getReportStats,
  getMatrizGravedad,
} from "../controllers/reporteController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/reports", getAllReports);
router.get("/reports/stats", getReportStats);
router.get("/reports/matriz", getMatrizGravedad);
router.get("/reports/:id", getReportById);
router.post("/reports", authMiddleware, createReport);
router.put("/reports/:id", authMiddleware, updateReport);
router.delete("/reports/:id", authMiddleware, deleteReport);

export default router;
