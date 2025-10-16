import { Router } from "express";
import {
  createTask,
  getAllTasks,
  getAllTasksByUserId,
} from "../controllers/task.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/tasks", authMiddleware, getAllTasks);
router.get("/tasks-by-user", authMiddleware, getAllTasksByUserId);
router.post("/tasks", authMiddleware, createTask);

export default router;
