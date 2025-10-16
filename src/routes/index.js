import { Router } from "express";
import authRoutes from "./auth.routes.js";
import taskRoutes from "./task.routes.js";
import statsRoutes from "./stats.route.js"; // ESTE es el router que quiero proteger
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/tasks", taskRoutes);
router.use("/stats", authMiddleware, statsRoutes);

export default router;