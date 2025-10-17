import { Router } from "express";
import { createQuickReport } from "../controllers/QuickReportController.js";

const router = Router();

// Ruta pública: POST /quick
router.post("/quick", createQuickReport);

export default router;


