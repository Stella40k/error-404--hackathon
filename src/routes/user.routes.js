import { Router } from "express";
import { getAllUsers } from "../controllers/user.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/users",authMiddleware, getAllUsers);

export default router;
