import { Router } from "express";
import { getAllReports, createReport } from "../controllers/reporteController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/reports", authMiddleware, getAllReports);
router.post("/reports", authMiddleware, createReport);

export default router;
