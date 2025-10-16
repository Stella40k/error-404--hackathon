import { Router } from "express";
import { createTask, getAllTasks, getAllTasksByUserId } from "../controllers/task.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const taskRoutes = Router();

taskRoutes.get("/tasks", authMiddleware, getAllTasks);
taskRoutes.get("/tasks-by-user", authMiddleware, getAllTasksByUserId);
taskRoutes.post("/tasks", authMiddleware, createTask);
